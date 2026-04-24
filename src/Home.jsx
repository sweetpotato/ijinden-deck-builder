// SPDX-License-Identifier: MIT

import { useCallback, useState } from 'react'
import { Alert } from 'react-bootstrap'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import { useParams } from 'react-router-dom'

import { decodeDeck } from './commons/dataCards'
import useDeck from './hooks/useDeck'
import useModalZoom from './useModalZoom'
import TabPaneCard from './TabPaneCard'
import useTabPaneDeck from './TabPaneDeck'
import useTabPaneLoad from './TabPaneLoad'
import useTabPaneSimulator from './TabPaneSimulator'

const enumTabPane = {
  CARD: 1,
  DECK: 2,
  LOAD: 3,
  SIMULATOR: 4,
  HELP: 5,
}

function Home() {
  // デッキコード関連
  const { code } = useParams()
  const resultsDecode = code && decodeDeck(code)
  const [entriesMain, entriesSide] = resultsDecode
    ? [resultsDecode[0], resultsDecode[1]]
    : [[], []]

  const [activeTab, setActiveTab] = useState(
    code ? enumTabPane.DECK : enumTabPane.CARD,
  )

  const moveToDeck = useCallback(() => {
    setActiveTab(enumTabPane.DECK)
  }, [setActiveTab])

  function moveToLoad() {
    setActiveTab(enumTabPane.LOAD)
  }

  const [deckMain, deckSide, dispatchDeck] = useDeck(entriesMain, entriesSide)
  const [zoomIn, renderZoom] = useModalZoom()
  const [interruptSimulator, renderTabPaneSimulator] = useTabPaneSimulator()

  const [setDeckTitle, renderTabPaneDeck] = useTabPaneDeck(
    code && !resultsDecode,
    dispatchDeck,
    zoomIn,
    moveToLoad,
    interruptSimulator,
  )

  const [setActiveDeckSaved, renderTabPaneLoad] = useTabPaneLoad(
    dispatchDeck.setFromEntries,
    moveToDeck,
    interruptSimulator,
  )

  const renderTabPaneDeckWrapper = (deckMain, deckSide) =>
    renderTabPaneDeck(deckMain, deckSide, setActiveDeckSaved)

  const renderTabPaneLoadWrapper = () => renderTabPaneLoad(setDeckTitle)

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
            deckMain={deckMain}
            deckSide={deckSide}
            dispatchDeck={dispatchDeck}
            zoomIn={zoomIn}
            interruptSimulator={interruptSimulator}
          />
        </Tab>
        <Tab eventKey={enumTabPane.DECK} title="レシピ">
          {renderTabPaneDeckWrapper(deckMain, deckSide)}
        </Tab>
        <Tab eventKey={enumTabPane.LOAD} title="マイデッキ">
          {renderTabPaneLoadWrapper()}
        </Tab>
        <Tab eventKey={enumTabPane.SIMULATOR} title="シミュ">
          {renderTabPaneSimulator(deckMain)}
        </Tab>
        <Tab eventKey={enumTabPane.HELP} title="ヘルプ" className="mx-2 mt-2">
          <h2>これは何？</h2>
          <p>
            イジンデンのデッキレシピを作成するアプリです。登録不要でどなたでも使えます。画像のダウンロードを除き、アプリの実行やデータの保存はお使いのコンピュータ
            (パソコン、スマホ) の中で完結します。
          </p>
          <p>
            このアプリは<b>非公認</b>です。制作者 (すいーとポテト)
            も公認サポーターではありません。公式 (大創出版やワンドローなど)
            への問い合わせはされませんよう、ご理解の上でご利用ください。
          </p>
          <h2>マイデッキ利用時のご注意</h2>
          <Alert variant="warning">
            iPhone の Safari ではインテリジェントトラッキング防止機能 (ITP)
            が有効かつアプリに7日間アクセスがないとマイデッキのデータがクリアされてしまうことにご注意ください。これは
            ITP
            の仕様によるものです。7日間以上データを保存したい場合、このアプリを
            iPhone のホーム画面に追加して、Safari
            からではなくホーム画面からご利用ください。詳しくは Apple
            公式サイトの「
            <a href="https://support.apple.com/ja-jp/guide/iphone/iph42ab2f3a7/ios">
              iPhoneのSafariでWebサイトをブックマークに登録する
            </a>
            」 → 「ホーム画面にWebサイトのアイコンを追加する」を参照ください。
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
            <li>
              作成したデッキレシピを共有リンクで他の人や自分の他の端末と共有可
            </li>
            <li>
              作成したデッキレシピを「マイデッキ」として端末のブラウザに保存可能
            </li>
            <li>作成したデッキレシピで手札のシミュレーションが可能</li>
          </ul>
          <h2>操作方法</h2>
          <h3>カードタブ</h3>
          <p>
            各カードのプラス・マイナスボタンでメインデッキ・サイドデッキ別々に枚数を増減できます。カード名、ルールテキスト、イラストレータ名を入力してカードの検索ができます。「条件で絞り込む」を開くとエキスパンション、レアリティ、色、種類、レベル、特性、能力語、遺業能力でカードの絞り込みができます。
          </p>
          <Alert variant="info">
            カード名のみ読み仮名のひらがなでも検索できます。ただしルールテキストを検索したい場合は文字通りに入力してください。例えばひらがなの「すとーん」で検索すると《ストーンマスク》などはヒットしますが《日野富子》などはヒットしません。後者もヒットさせたい場合はカタカナの「ストーン」で検索してください。
          </Alert>
          <Alert variant="info">
            検索はルールテキスト全体を探します。例えば「執筆」で検索すると《清少納言》など執筆能力を持つカードだけでなく《始皇帝》などもヒットします。前者のみヒットさせたい場合は検索ではなく「条件で絞り込む」の能力語を使用ください。特性や遺業能力も同様です。
          </Alert>
          <Alert variant="info">
            検索はイラストレータ名も探します。英大小文字の区別はなく、部分一致でもヒットします。ただし「é」などアクセント符号付きの文字は符号なしの「e」ではヒットしません。また、日本語名の場合は読み仮名ではヒットせず、同一人物の別名義にも文字が一致していなければヒットしません。
          </Alert>
          <Alert variant="info">
            オブシディアンの印刷されているレアリティは「N」ですが、このアプリでは「R」として扱います。
          </Alert>
          <h3>レシピタブ</h3>
          <p>
            カードの左下をタップする
            (パソコンではカードの上にマウスカーソルを当てる)
            と、そのカードに重なるボタンが現れます。各ボタンで枚数の増減やメインデッキ・サイドデッキの入換え、カード画像のズームができます。
          </p>
          <p>
            保存ボタンで作成したデッキレシピをマイデッキに保存できます。また、クリアボタンでデッキレシピを最初から編集し直すことができます。
          </p>
          <h4>レシピ画像をダウンロード</h4>
          <p>
            レシピタブの下方にある「レシピ画像をダウンロード」ボタンで、編集中のデッキレシピを画像としてダウンロードできます。
          </p>
          <h4>共有リンクをコピー</h4>
          <p>
            レシピタブの下方にある「▶共有リンクをコピー」ボタンで、作成したデッキを他の人や自分の他の端末と共有するためのリンクをコピーできます。どこかのサーバにデッキのデータを保存しているわけではなく、共有リンクの
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
          <h4>テキストデータをコピー</h4>
          <p>
            レシピタブの下方にある「▼テキストデータをコピー」ボタンで、デッキレシピのテキストデータをクリップボードにコピーできます。Excel
            や Google
            スプレッドシートにそのまま貼り付けられる形式になっています。
          </p>
          <h3>マイデッキタブ</h3>
          <p>
            保存した各デッキレシピのボタンで読込みや削除ができます。保存済みデッキレシピをすべて削除することもできます。
          </p>
          <Alert variant="info">
            デッキレシピの番号は飛び飛びになることがありますのでご承知ください。これは削除したデッキレシピの番号を再利用していないためです。
          </Alert>
          <h3>シミュタブ (手札シミュレータ)</h3>
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
          <h3>並び順の変更</h3>
          <p>ご面倒ですがこのまま使用ください。</p>
          <h2>連絡先</h2>
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
      {renderZoom()}
    </>
  )
}

export default Home
