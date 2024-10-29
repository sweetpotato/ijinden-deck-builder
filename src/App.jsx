import { useEffect, useReducer, useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import TabPaneCard from './TabPaneCard';
import TabPaneDeck from './TabPaneDeck';
import TabPaneSave from './TabPaneSave';
import TabPaneSimulator from './TabPaneSimulator';
import enumTabPane from './enumTabPane';
import { enumStateSimulator, reducerSimulator } from './reducerSimulator';

import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import db from './db';

function App() {
  // localStorage のマイデッキを IndexedDB へ移行する。
  //
  // フェッチのキャンセルのパターンにあわせてコードを書いたつもりだが、
  // Strict Mode の開発環境ではどうしても2回実行されてしまい、
  // 移行元のデッキが移行先でダブる事象を確認した。それとあわせて、
  // Strict Mode を外す (本番環境を模倣する) とダブらないことも確認した。
  //
  // Strict Mode を外した本番環境では意図どおりに動くはずであること、
  // またこのコードが必要な期間が1週間程度と長くないことから、
  // このコードで妥協して本番環境にデプロイすることにする。
  //
  // このコードが不要になったらマイデッキのベータを外すこと。
  //
  useEffect(() => {
    let active = true;

    const moveDecks = async () => {
      if (typeof window === 'undefined') {
        return;
      }
      // localStorage からデッキを読み込む
      const stringifiedDecks = window.localStorage.getItem('ijinden-deck-builder');
      if (stringifiedDecks === null) {
        return;
      }
      const decksToBeMoved = JSON.parse(stringifiedDecks).map((e) => ({
        // IDとタイムスタンプは新しくする
        ...e[1], timestamp: new Date(),
      }));
      if (active) {
        // IndexedDB へデッキを保存する
        await db.decks.bulkAdd(decksToBeMoved);
        // localStorage のデータを削除する
        window.localStorage.setItem('ijinden-deck-builder', '[]');
      }
    };
    moveDecks();

    return () => {
      active = false;
    };
  }, []);

  const [deckMain, setDeckMain] = useState(new Map());
  const [deckSide, setDeckSide] = useState(new Map());
  const [activeTab, setActiveTab] = useState(enumTabPane.CARD);
  const [activeDeckSaved, setActiveDeckSaved] = useState([]);
  const [stateSimulator, dispatchSimulator] = useReducer(
    reducerSimulator,
    enumStateSimulator.INITIAL,
  );

  function handleSetDeckMain(newDeckMain) {
    setDeckMain(newDeckMain);
  }

  function handleSetDeckSide(newDeckSide) {
    setDeckSide(newDeckSide);
  }

  function handleSetActiveTab(newActiveTab) {
    setActiveTab(newActiveTab);
  }

  function handleSetActiveDeckSaved(newActiveDeckSaved) {
    setActiveDeckSaved(newActiveDeckSaved);
  }

  return (
    <>
      <h1 className="m-2">イジンデン デッキ作成</h1>
      <Tabs
        activeKey={activeTab}
        defaultActiveKey={enumTabPane.CARD}
        transition={false}
        onSelect={(k) => setActiveTab(k)}
      >
        <Tab eventKey={enumTabPane.CARD} title="カード">
          <TabPaneCard
            deckMain={deckMain}
            handleSetDeckMain={handleSetDeckMain}
            deckSide={deckSide}
            handleSetDeckSide={handleSetDeckSide}
            dispatchSimulator={dispatchSimulator}
          />
        </Tab>
        <Tab eventKey={enumTabPane.DECK} title="レシピ">
          <TabPaneDeck
            deckMain={deckMain}
            handleSetDeckMain={handleSetDeckMain}
            deckSide={deckSide}
            handleSetDeckSide={handleSetDeckSide}
            handleSetActiveDeckSaved={handleSetActiveDeckSaved}
            handleSetActiveTab={handleSetActiveTab}
            dispatchSimulator={dispatchSimulator}
          />
        </Tab>
        <Tab eventKey={enumTabPane.SAVE_AND_LOAD} title="マイデッキβ">
          <TabPaneSave
            handleSetDeckMain={handleSetDeckMain}
            handleSetDeckSide={handleSetDeckSide}
            activeDeckSaved={activeDeckSaved}
            handleSetActiveDeckSaved={handleSetActiveDeckSaved}
            handleSetActiveTab={handleSetActiveTab}
            dispatchSimulator={dispatchSimulator}
          />
        </Tab>
        <Tab eventKey={enumTabPane.SIMULATOR} title="シミュ">
          <TabPaneSimulator deck={deckMain} state={stateSimulator} dispatch={dispatchSimulator} />
        </Tab>
        <Tab eventKey={enumTabPane.HELP} title="ヘルプ" className="m-2">
          <h2>マイデッキ (ベータ版) 使用時の注意</h2>
          <p>マイデッキは端末のブラウザの localStorage に保存しています。そのため、次にご注意ください。</p>
          <ul>
            <li>端末やブラウザをまたいでは、同じマイデッキは利用できないこと。</li>
            <li>複数のタブで同時にレシピの保存を試みたり、レシピの保存中にタブを閉じたりブラウザを停止させたりすると、マイデッキのデータが破損する可能性があること。</li>
            <li>
              <b>
                iOS/iPadOS/macOS の Safari
              </b>
              {' '}
              ではインテリジェントトラッキング防止機能 (
              <a href="https://webkit.org/blog/9521/intelligent-tracking-prevention-2-3/">
                ITP 2.3
              </a>
              {' '}
              (英語サイト)) により、
              <b>
                アプリの最後のご利用から7日間が経過するとマイデッキのデータが削除される
              </b>
              こと。
            </li>
          </ul>
          <h2>これは何？</h2>
          <p>イジンデンのデッキレシピを作成するアプリです。</p>
          <h2>快適にご利用いただくために</h2>
          <p>
            あらかじめ通信環境の良いところで、イジンデン公式サイトの「
            <a href="https://one-draw.jp/ijinden/cardlist.html">カードリスト</a>
            」以下にある各エキスパンションのページを開いて、カード画像を読み込んでおいてください。
          </p>
          <h2>特徴</h2>
          <ul>
            <li>デッキ枚数の上限なし</li>
            <li>メインデッキとサイドデッキを別個に管理可能</li>
            <li>レシピを「マイデッキ」としてブラウザに保存可能 (ベータ版)</li>
            <li>デッキのカード枚数はカード名ごとに数字で表示</li>
            <li>デッキのカードの並びは種類、レベル、色、魔力コスト、エキスパンション順</li>
          </ul>
          <h2>操作方法</h2>
          <h3>カード</h3>
          <p>各カードのプラス・マイナスボタンで、メインデッキ・サイドデッキ別々に枚数を増減できます。エキスパンション、色、種類、能力語でカードの絞り込みができます。</p>
          <h3>レシピ</h3>
          {/* eslint-disable max-len */}
          <p>カードの左下をタップする (パソコンではカードの上にマウスカーソルを当てる) と、そのカードに重なるボタンが現れます。各ボタンで枚数の増減やメインデッキ・サイドデッキの入換え、カード画像のズームができます。</p>
          <p>保存ボタンで、作成したレシピをマイデッキ (ベータ版) に保存できます。また、クリアボタンで、レシピを最初から編集し直すことができます。</p>
          {/* eslint-enable max-len */}
          <h3>マイデッキ (ベータ版)</h3>
          <p>保存した各レシピのボタンで読込みや削除ができます。保存済みレシピを全て削除することもできます。</p>
          <h3>シミュ (手札シミュレータ)</h3>
          {/* eslint-disable max-len */}
          <p>初期のガーディアンと手札、およびその後のドローをランダムに表示します。スタートボタンを押した直後は対戦開始前の状態であり、マリガン (引き直す) ボタンかキープ (引き直さない) ボタンを押すと手札とドローが確定します。灰色のガーディアンはタップする (パソコンではカードの上にマウスカーソルを当てる) とオモテ面のカード画像が表示されます。リセットボタンでやり直します。</p>
          {/* eslint-enable max-len */}
          <h2>未対応機能</h2>
          <dl>
            <dt>自前の画像保存</dt>
            <dd>OS のスクショ機能で保存願います。</dd>
            <dd>
              Windows:
              {' '}
              <a href="https://support.microsoft.com/ja-jp/windows/snipping-tool-%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3-%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88%E3%82%92%E3%82%AD%E3%83%A3%E3%83%97%E3%83%81%E3%83%A3%E3%81%99%E3%82%8B-00246869-1843-655f-f220-97299b865f6b">Snipping Tool を使ってスクリーン ショットをキャプチャする</a>
            </dd>
            <dd>
              Android:
              {' '}
              <a href="https://support.google.com/android/answer/9075928?hl=ja&sjid=12199801082883893448-AP">Android デバイスで画面の画像（スクリーンショット）または動画を撮影する</a>
              {' '}
              → スクロール スクリーンショットを撮る
            </dd>
            <dd>
              iPhone:
              {' '}
              <a href="https://support.apple.com/ja-jp/guide/iphone/iphc872c0115/ios">iPhoneでスクリーンショットを撮る</a>
              {' '}
              → フルページのスクリーンショットを撮る
            </dd>
            <dt>高度な検索</dt>
            <dd>お手数ですがカードリストから探してください。</dd>
            <dt>並び順の変更</dt>
            <dd>ご面倒ですがこのまま使用ください。</dd>
            <dt>PSR カード</dt>
            <dd>対応する SR のカードを使用ください。</dd>
          </dl>
          <h2>連絡先</h2>
          <h3>リポジトリ</h3>
          <p><a href="https://github.com/sweetpotato/ijinden-deck-builder/">https://github.com/sweetpotato/ijinden-deck-builder/</a></p>
          <h3>メールアドレス</h3>
          <p>すいーとポテト &lt;sweetpotato DOT quarter PLUS github AT gmail DOT com&gt;</p>
        </Tab>
      </Tabs>
    </>
  );
}

export default App;
