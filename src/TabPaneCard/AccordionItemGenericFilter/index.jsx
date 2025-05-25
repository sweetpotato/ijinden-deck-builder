// SPDX-License-Identifier: MIT

import { useCallback, useDeferredValue, useState } from 'react'

import AccordionItemGenericFilter from './AccordionItemGenericFilter'

function useAccordionItemGenericFilter(title, data) {
  const [state, setState] = useState(0)
  // 「条件すべてをリセットする」ボタンを押した直後に 500ms ほど
  // 画面が固まって見える事象を解消するために、遅延状態を導入する。
  // この事象は当該ボタン操作によりフィルタをリセットした際に行すべての
  // 再レンダリングが走ることで発生する。遅延状態の導入前は、この
  // 再レンダリングが終わってはじめてトグルボタンのチェック状態という
  // 見た目が変わるため、画面が固まって見えていた。
  //
  // そこで、内部では素の状態を使用して当該ボタン操作が即座に反映された
  // ように見せつつ、外部へは遅延状態を返して行のレンダリングを遅延
  // させ、固まって見える度合いを軽減する。行のレンダリング自体は
  // 不可避であり、トグルボタンの状態という見た目が変わってからおそらく
  // 500ms 後に反映された行が表示される。
  //
  // この遅延レンダリングが頻繁に見えてしまえばユーザにとっても違和感が
  // あるだろう。しかし「条件すべてをリセットする」ボタンは画面上部に
  // あり、それを表示した状態なら画面にはほぼフィルタしか見えておらず、
  // 行は画面下端の外に追いやられているため、遅延レンダリングが頻繁に
  // 見えてしまうことはない。よって採用するに足りると判断した。
  const deferredState = useDeferredValue(state)

  const reset = () => setState(0)
  const handleChangeState = useCallback(
    (e) => setState(Number(e.currentTarget.value)),
    [setState]
  )
  const render = (eventKey) => (
    <AccordionItemGenericFilter
      eventKey={eventKey}
      title={title}
      state={state}
      handleChangeState={handleChangeState}
      data={data}
    />
  )
  return [deferredState, reset, render]
}

export default useAccordionItemGenericFilter
