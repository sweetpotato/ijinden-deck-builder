export const enumStateSimulator = {
  INITIAL: 0,
  RUNNING: 1,
  FINISHED: 2,
  ABORTED: 3,
  LESS_THAN_TEN: 4
};

export const enumActionSimulator = {
  RESET: 0,
  START: 1,
  CONTINUE: 2,
  INTERRUPT: 3,
  CHECK_MAIN_DECK: 4
};

export function reducerSimulator(state, action) {
  switch (state) {
    case enumStateSimulator.INITIAL:
      switch (action) {
        case enumActionSimulator.START:
          return enumStateSimulator.RUNNING;
        case enumActionSimulator.CHECK_MAIN_DECK:
          return enumStateSimulator.LESS_THAN_TEN;
        default:
          break;
      }
      break;
    case enumStateSimulator.RUNNING:
      switch (action) {
        case enumActionSimulator.RESET:
          return enumStateSimulator.INITIAL;
        case enumActionSimulator.CONTINUE:
          return enumStateSimulator.FINISHED;
        case enumActionSimulator.INTERRUPT:
          return enumStateSimulator.ABORTED;
        default:
          break;
      }
      break;
    case enumStateSimulator.FINISHED:
      switch (action) {
        case enumActionSimulator.RESET:
          return enumStateSimulator.INITIAL;
        default:
          break;
      }
      break;
    case enumStateSimulator.ABORTED:
      switch (action) {
        case enumActionSimulator.RESET:
          return enumStateSimulator.INITIAL;
        default:
          break;
      }
      break;
    case enumStateSimulator.LESS_THAN_TEN:
      switch (action) {
        case enumActionSimulator.RESET:
          return enumStateSimulator.INITIAL;
        default:
          break;
      }
      break;
    default:
      // Do nothing
  }

  return state;
}
