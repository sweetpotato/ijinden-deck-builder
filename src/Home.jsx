// SPDX-License-Identifier: MIT

import { useReducer, useState } from 'react'
import {
  Alert,
  Modal,
  ModalBody,
  ModalHeader,
  ModalTitle,
} from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'

import TabPaneCard from './TabPaneCard'
import TabPaneDeck from './TabPaneDeck'
import TabPaneSave from './TabPaneSave'
import TabPaneSimulator from './TabPaneSimulator'
import enumTabPane from './commons/enumTabPane'
import { dataCardsMap, decodeDeck } from './commons/dataCards'
import { enumStateSimulator, reducerSimulator } from './hooks/reducerSimulator'

function App() {
  // デッキコード関連
  const { code } = useParams()
  const resultsDecode = code && decodeDeck(code)
  const [entriesMain, entriesSide] = resultsDecode
    ? [resultsDecode[0], resultsDecode[1]]
    : [[], []]
  const [activeTab, setActiveTab] = useState(
    code ? enumTabPane.DECK : enumTabPane.CARD
  )
  const [showCodeError, setShowCodeError] = useState(!resultsDecode)

  const [idZoom, setIdZoom] = useState(null)
  const [deckTitle, setDeckTitle] = useState('')
  const [deckMain, setDeckMain] = useState(new Map(entriesMain))
  const [deckSide, setDeckSide] = useState(new Map(entriesSide))
  const [activeDeckSaved, setActiveDeckSaved] = useState([])
  const [stateSimulator, dispatchSimulator] = useReducer(
    reducerSimulator,
    enumStateSimulator.INITIAL
  )

  function handleSetShowCodeError(newShowCodeError) {
    setShowCodeError(newShowCodeError)
  }

  function handleSetIdZoom(newIdZoom) {
    setIdZoom(newIdZoom)
  }

  function handleClearIdZoom() {
    setIdZoom(null)
  }

  function handleSetDeckTitle(newDeckTitle) {
    setDeckTitle(newDeckTitle)
  }

  function handleSetDeckMain(newDeckMain) {
    setDeckMain(newDeckMain)
  }

  function handleSetDeckSide(newDeckSide) {
    setDeckSide(newDeckSide)
  }

  function handleSetActiveTab(newActiveTab) {
    setActiveTab(newActiveTab)
  }

  function handleSetActiveDeckSaved(newActiveDeckSaved) {
    setActiveDeckSaved(newActiveDeckSaved)
  }

  return (
    <>
      <h1 className="m-2">イジンデン デッキ作成</h1>
      <Tabs
        activeKey={activeTab}
        transition={false}
        onSelect={(k) => setActiveTab(k)}
      >
        <Tab eventKey={enumTabPane.CARD} title="カード">
          <TabPaneCard
            handleSetIdZoom={handleSetIdZoom}
            deckMain={deckMain}
            handleSetDeckMain={handleSetDeckMain}
            deckSide={deckSide}
            handleSetDeckSide={handleSetDeckSide}
            dispatchSimulator={dispatchSimulator}
          />
        </Tab>
        <Tab eventKey={enumTabPane.DECK} title="レシピ">
          <TabPaneDeck
            code={code}
            showCodeError={showCodeError}
            handleSetShowCodeError={handleSetShowCodeError}
            handleSetIdZoom={handleSetIdZoom}
            deckTitle={deckTitle}
            handleSetDeckTitle={handleSetDeckTitle}
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
            handleSetDeckTitle={handleSetDeckTitle}
            handleSetDeckMain={handleSetDeckMain}
            handleSetDeckSide={handleSetDeckSide}
            activeDeckSaved={activeDeckSaved}
            handleSetActiveDeckSaved={handleSetActiveDeckSaved}
            handleSetActiveTab={handleSetActiveTab}
            dispatchSimulator={dispatchSimulator}
          />
        </Tab>
        <Tab eventKey={enumTabPane.SIMULATOR} title="シミュ">
          <TabPaneSimulator
            deck={deckMain}
            state={stateSimulator}
            dispatch={dispatchSimulator}
          />
        </Tab>
        <Tab eventKey={enumTabPane.HELP} title="ヘルプ" className="mx-2 mt-2">
          <h2>これは何？</h2>
          <p>イジンデンのデッキレシピを作成するアプリです。</p>
          <h2>マイデッキ利用時のご注意</h2>
          <Alert variant="warning">
            iPhone の Safari ではインテリジェントトラッキング防止機能 (ITP)
            が有効かつアプリに7日間アクセスがないとマイデッキのデータがクリアされてしまうことにご注意ください。これは
            ITP の仕様によるものです。
          </Alert>
          <Alert variant="warning">
            マイデッキは「サイトデータ」として端末のブラウザに保存しているため、Safari
            では「履歴と Web サイトデータを消去」、Chrome
            では「クッキーと他のサイトデータ」を削除するとクリアされてしまうことにご注意ください。他のブラウザでも同様です。
          </Alert>
          <Alert variant="info">
            端末やブラウザをまたいでは同じマイデッキを利用できませんのでご承知ください。
          </Alert>
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
            <li>
              デッキのカードの並びは種類、レベル、色、魔力コスト、エキスパンション順
            </li>
            <li>レシピを「マイデッキ」としてブラウザに保存可能</li>
            <li>共有リンクでマイデッキに保存したレシピを他の人と共有可</li>
            <li>作成したデッキで手札のシミュレーションが可能</li>
          </ul>
          <h2>操作方法</h2>
          <h3>カード</h3>
          <p>
            各カードのプラス・マイナスボタンで、メインデッキ・サイドデッキ別々に枚数を増減できます。エキスパンション、色、種類、レベル、能力語、特性でカードの絞り込みができます。
          </p>
          <h3>レシピ</h3>
          <p>
            カードの左下をタップする
            (パソコンではカードの上にマウスカーソルを当てる)
            と、そのカードに重なるボタンが現れます。各ボタンで枚数の増減やメインデッキ・サイドデッキの入換え、カード画像のズームができます。
          </p>
          <p>
            保存ボタンで作成したレシピをマイデッキに保存できます。また、クリアボタンでレシピを最初から編集し直すことができます。
          </p>
          <h4>テキストでエクスポートβ</h4>
          <p>
            レシピタブの下方にはテキスト表現されたデッキ情報があり、「テキストをコピー」ボタンを押すとクリップボードにコピーできます。Excel
            や Google
            スプレッドシートにそのまま貼り付けられる形式になっています。
          </p>
          <h3>マイデッキ</h3>
          <p>
            保存した各レシピのボタンで読込みや削除ができます。保存済みレシピをすべて削除することもできます。
          </p>
          <Alert variant="info">
            レシピの番号は飛び飛びになることがありますのでご承知ください。これは削除したレシピの番号を再利用していないためです。
          </Alert>
          <h4>共有リンク</h4>
          <p>
            マイデッキに保存したレシピを他の人や自分の他の端末と共有できます。どこかのサーバにデッキのデータを保存しているわけではなく、共有リンクの
            URL の中にデッキの内容を「復活の呪文」のように埋め込んでいます。
          </p>
          <Alert variant="warning">
            SNS などに共有リンクを貼り付ける際に、当該 SNS などに備わっている
            URL 短縮機能によって共有リンクのハッシュ (#)
            以降が失われてしまう可能性があることにご注意ください。デッキの内容はハッシュ以降の長い文字列に埋め込まれているため、失われるとデッキを復元できません。なお、少なくとも
            X (t.co), Bluesky, LINE では問題ないようです。
          </Alert>
          <Alert variant="warning">
            コピーした共有リンクはそのまま使用ください。共有リンクのハッシュ (#)
            以降を変更すると、デッキを復元できなくなってしまったり、異なる内容のデッキが復元されてしまいます。
          </Alert>
          <Alert variant="info">
            同じ内容のデッキであれば、誰がどの端末で作成しても、同じ共有リンクになります。
          </Alert>
          <Alert variant="info">デッキ名は共有リンクで共有できません。</Alert>
          <h3>シミュ (手札シミュレータ)</h3>
          <p>
            対戦開始時のガーディアンと手札、およびその後のドローをランダムに表示します。
          </p>
          <p>
            スタートボタンを押した直後は対戦開始前の状態です。1回だけマリガンボタンで手札を引き直せます。リセットボタンでやり直します。
          </p>
          <p>
            灰色の手札は山札からドローするカードです。タップ (PCではクリック)
            するとオモテ面のカード画像が表示され、さらにタップしていくと通常→赤→青→黄→白→黒→通常の順で色味が変わります。灰色のガーディアンも同様に操作できます。
          </p>
          <h2>未対応機能</h2>
          <h3>自前の画像保存</h3>
          <p>OS のスクリーンショット機能で保存願います。</p>
          <ul>
            <li>
              Windows:{' '}
              <a href="https://support.microsoft.com/ja-jp/windows/snipping-tool-%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3-%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88%E3%82%92%E3%82%AD%E3%83%A3%E3%83%97%E3%83%81%E3%83%A3%E3%81%99%E3%82%8B-00246869-1843-655f-f220-97299b865f6b">
                Snipping Tool を使ってスクリーン ショットをキャプチャする
              </a>
            </li>
            <li>
              Android:{' '}
              <a href="https://support.google.com/android/answer/9075928?hl=ja&sjid=12199801082883893448-AP">
                Android
                デバイスで画面の画像（スクリーンショット）または動画を撮影する
              </a>{' '}
              → スクロール スクリーンショットを撮る
            </li>
            <li>
              iPhone:{' '}
              <a href="https://support.apple.com/ja-jp/guide/iphone/iphc872c0115/ios">
                iPhoneでスクリーンショットを撮る
              </a>{' '}
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
            <a href="https://discord.com/invite/3dPgu5G9uB">天草サーバー</a>
            」にいます。
          </p>
          <h3>リポジトリ</h3>
          <p>
            <a href="https://github.com/sweetpotato/ijinden-deck-builder/">
              https://github.com/sweetpotato/ijinden-deck-builder/
            </a>
          </p>
          <h3>メールアドレス</h3>
          <p>
            すいーとポテト &lt;sweetpotato DOT quarter PLUS github AT gmail DOT
            com&gt;
          </p>
        </Tab>
      </Tabs>
      {idZoom !== null && (
        <Modal show onHide={handleClearIdZoom}>
          <ModalHeader closeButton>
            <ModalTitle>{dataCardsMap.get(idZoom).name}</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <img
              src={dataCardsMap.get(idZoom).imageUrl}
              alt={dataCardsMap.get(idZoom).name}
              style={{ width: '100%', height: 'auto' }}
            />
          </ModalBody>
        </Modal>
      )}
    </>
  )
}

export default App
