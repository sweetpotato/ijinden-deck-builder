// SPDX-License-Identifier: MIT

import React, { useReducer, useState } from 'react';
import { Alert } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import TabPaneCard from './TabPaneCard';
import TabPaneDeck from './TabPaneDeck';
import TabPaneSave from './TabPaneSave';
import TabPaneSimulator from './TabPaneSimulator';
import enumTabPane from '../commons/enumTabPane';
import { enumStateSimulator, reducerSimulator } from '../hooks/reducerSimulator';

function App() {
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
        <Tab eventKey={enumTabPane.SAVE_AND_LOAD} title="マイデッキ">
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
        <Tab eventKey={enumTabPane.HELP} title="ヘルプ" className="mx-2 mt-2">
          <h2>これは何？</h2>
          <p>イジンデンのデッキレシピを作成するアプリです。</p>
          <h2>マイデッキ利用時のご注意</h2>
          {/* eslint-disable max-len */}
          <Alert variant="warning">マイデッキは「サイトデータ」として端末のブラウザに保存しているため、Safari では「履歴と Web サイトデータを消去」、Chrome では「クッキーと他のサイトデータ」を削除するとクリアされてしまうことにご注意ください。他のブラウザでも同様です。</Alert>
          {/* eslint-enable max-len */}
          <Alert variant="info">端末やブラウザをまたいでは同じマイデッキを利用できませんのでご承知ください。</Alert>
          <h2>快適にご利用いただくために</h2>
          <Alert variant="success">
            あらかじめ通信環境の良いところで、イジンデン公式サイトの「
            <a href="https://one-draw.jp/ijinden/cardlist.html">カードリスト</a>
            」以下にある各エキスパンションのページを開いて、すべてのカード画像を読み込んでおいてください。これはカード画像のキャッシュを有効にするためです。
          </Alert>
          <h2>特徴</h2>
          <ul>
            <li>デッキ枚数の上限なし</li>
            <li>デッキのカード枚数はカード名ごとに数字で表示</li>
            <li>メインデッキとサイドデッキを別個に管理可能</li>
            <li>デッキのカードの並びは種類、レベル、色、魔力コスト、エキスパンション順</li>
            <li>レシピを「マイデッキ」としてブラウザに保存可能</li>
          </ul>
          <h2>操作方法</h2>
          <h3>カード</h3>
          <p>各カードのプラス・マイナスボタンで、メインデッキ・サイドデッキ別々に枚数を増減できます。エキスパンション、色、種類、能力語でカードの絞り込みができます。</p>
          <h3>レシピ</h3>
          {/* eslint-disable max-len */}
          <p>カードの左下をタップする (パソコンではカードの上にマウスカーソルを当てる) と、そのカードに重なるボタンが現れます。各ボタンで枚数の増減やメインデッキ・サイドデッキの入換え、カード画像のズームができます。</p>
          {/* eslint-enable max-len */}
          <p>保存ボタンで作成したレシピをマイデッキに保存できます。また、クリアボタンでレシピを最初から編集し直すことができます。</p>
          <h3>マイデッキ</h3>
          <p>保存した各レシピのボタンで読込みや削除ができます。保存済みレシピをすべて削除することもできます。</p>
          <Alert variant="info">レシピの番号は飛び飛びになることがありますのでご承知ください。これは削除したレシピの番号を再利用していないためです。</Alert>
          <h3>シミュ (手札シミュレータ)</h3>
          {/* eslint-disable max-len */}
          <p>対戦開始時のガーディアンと手札、およびその後のドローをランダムに表示します。</p>
          <p>スタートボタンを押した直後は対戦開始前の状態であり、マリガン (引き直す) ボタンかキープ (引き直さない) ボタンを押すと手札とドローが確定します。リセットボタンでやり直します。</p>
          <p>灰色のガーディアンはタップする (パソコンではカードの上にマウスカーソルを当てる) とオモテ面のカード画像が表示されます。</p>
          {/* eslint-enable max-len */}
          <h2>未対応機能</h2>
          <h3>自前の画像保存</h3>
          <p>OS のスクリーンショット機能で保存願います。</p>
          <ul>
            <li>
              Windows:
              {' '}
              <a href="https://support.microsoft.com/ja-jp/windows/snipping-tool-%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3-%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88%E3%82%92%E3%82%AD%E3%83%A3%E3%83%97%E3%83%81%E3%83%A3%E3%81%99%E3%82%8B-00246869-1843-655f-f220-97299b865f6b">Snipping Tool を使ってスクリーン ショットをキャプチャする</a>
            </li>
            <li>
              Android:
              {' '}
              <a href="https://support.google.com/android/answer/9075928?hl=ja&sjid=12199801082883893448-AP">Android デバイスで画面の画像（スクリーンショット）または動画を撮影する</a>
              {' '}
              → スクロール スクリーンショットを撮る
            </li>
            <li>
              iPhone:
              {' '}
              <a href="https://support.apple.com/ja-jp/guide/iphone/iphc872c0115/ios">iPhoneでスクリーンショットを撮る</a>
              {' '}
              → フルページのスクリーンショットを撮る
            </li>
          </ul>
          <h3>高度な検索</h3>
          <p>お手数ですがカードリストから探してください。</p>
          <h3>並び順の変更</h3>
          <p>ご面倒ですがこのまま使用ください。</p>
          <h3>PSR カード</h3>
          <p>対応する SR のカードを使用ください。</p>
          <h2>連絡先</h2>
          <p>
            普段は Discord の「
            <a href="https://discord.com/invite/3dPgu5G9uB">
              天草サーバー
            </a>
            」にいます。
          </p>
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
