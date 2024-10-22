import { useReducer, useState } from 'react';
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

function App() {
  const [deckMain, setDeckMain] = useState(new Map());
  const [deckSide, setDeckSide] = useState(new Map());
  const [activeTab, setActiveTab] = useState(enumTabPane.CARD);
  const [stateSimulator, dispatchSimulator] = useReducer(reducerSimulator, enumStateSimulator.INITIAL);

  return (
    <>
      <h1 className="m-2">イジンデン デッキ作成</h1>
      <Tabs activeKey={activeTab} defaultActiveKey={enumTabPane.CARD} transition={false} onSelect={(k) => setActiveTab(k)}>
        <Tab eventKey={enumTabPane.CARD} title="カード">
          <TabPaneCard
            deckMain={deckMain}
            setDeckMain={setDeckMain}
            deckSide={deckSide}
            setDeckSide={setDeckSide}
            dispatchSimulator={dispatchSimulator}
          />
        </Tab>
        <Tab eventKey={enumTabPane.DECK} title="レシピ">
          <TabPaneDeck
            deckMain={deckMain}
            setDeckMain={setDeckMain}
            deckSide={deckSide}
            setDeckSide={setDeckSide}
            dispatchSimulator={dispatchSimulator}
          />
        </Tab>
        <Tab eventKey={enumTabPane.SAVE_AND_LOAD} title="マイデッキβ">
          <TabPaneSave
            deckMain={deckMain}
            setDeckMain={setDeckMain}
            deckSide={deckSide}
            setDeckSide={setDeckSide}
            setActiveTab={setActiveTab}
            dispatchSimulator={dispatchSimulator}
          />
        </Tab>
        <Tab eventKey={enumTabPane.SIMULATOR} title="シミュβ">
          <TabPaneSimulator deck={deckMain} state={stateSimulator} dispatch={dispatchSimulator} />
        </Tab>
        <Tab eventKey={enumTabPane.HELP} title="ヘルプ" className="m-2">
          <h2>これは何？</h2>
          <p>イジンデンのデッキリストを作成するアプリです。機能は最小限にとどめています。</p>
          <p>GitHub で開発しています。リポジトリは次の URL です。</p>
          <p><a href="https://github.com/sweetpotato/ijinden-deck-builder/">https://github.com/sweetpotato/ijinden-deck-builder/</a></p>
          <h2>特徴</h2>
          <ul>
            <li>デッキ枚数の上限なし</li>
            <li>メインデッキとサイドデッキを別個に管理可能</li>
            <li>デッキのカード枚数はカード名ごとに数字で表示</li>
            <li>デッキのカードの並びは種類、レベル、色、魔力コスト、エキスパンション順</li>
          </ul>
          <h2>操作方法</h2>
          <h3>カード</h3>
          <p>各カードのプラス・マイナスボタンで、メインデッキ・サイドデッキ別々に枚数を増減できます。エキスパンション、色、種類、能力語でカードの絞り込みができます。</p>
          <h3>デッキ</h3>
          <p>カードの左下をタップする（パソコンではカードの上にマウスカーソルを当てる）と、そのカードに重なるボタンが現れます。各ボタンで枚数の増減やメインデッキ・サイドデッキの入換えができます。</p>
          <h2>未対応機能</h2>
          <dl>
            <dt>自前の画像保存</dt>
            <dd>OS のスクショ機能で保存願います。</dd>
            <dd>Windows: <a href="https://support.microsoft.com/ja-jp/windows/snipping-tool-%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3-%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88%E3%82%92%E3%82%AD%E3%83%A3%E3%83%97%E3%83%81%E3%83%A3%E3%81%99%E3%82%8B-00246869-1843-655f-f220-97299b865f6b">Snipping Tool を使ってスクリーン ショットをキャプチャする</a></dd>
            <dd>Android: <a href="https://support.google.com/android/answer/9075928?hl=ja&sjid=12199801082883893448-AP">Android デバイスで画面の画像（スクリーンショット）または動画を撮影する</a> → スクロール スクリーンショットを撮る</dd>
            <dd>iPhone: <a href="https://support.apple.com/ja-jp/guide/iphone/iphc872c0115/ios">iPhoneでスクリーンショットを撮る</a> → フルページのスクリーンショットを撮る</dd>
            <dt>デッキ保存</dt>
            <dd>お手数ですが再入力をお願いします。</dd>
            <dt>高度な検索</dt>
            <dd>お手数ですがカードリストから探してください。</dd>
            <dt>並び順の変更</dt>
            <dd>ご面倒ですがこのまま使用ください。</dd>
            <dt>PSR カード</dt>
            <dd>対応する SR のカードを使用ください。</dd>
          </dl>
          <h2>連絡先</h2>
          <p>すいーとポテト &lt;sweetpotato DOT quarter PLUS github AT gmail DOT com&gt;</p>
        </Tab>
      </Tabs>
    </>
  );
}

export default App;
