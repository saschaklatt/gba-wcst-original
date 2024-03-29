import { Reducer, AnyAction } from "redux"
import last from "lodash/last"
import { GameState, PlayCardPayload } from "./game.props"
import {
  getInitialState,
  CRITERIA_CHANGE_THRESHOLD,
  SCORE_WIN,
  SCORE_LOSE,
} from "./game.state"
import { PLAY_CARD, RESET } from "./game.actions"

const game: Reducer<GameState, AnyAction> = (
  state = getInitialState(),
  action
) => {
  switch (action.type) {
    case PLAY_CARD:
      return doPlayCard(state, action.payload)
    case RESET:
      return getInitialState()
    default:
      return state
  }
}

const doPlayCard = (state: GameState, payload: PlayCardPayload): GameState => {
  const { isCorrect } = payload
  const round = state.round + 1
  const newCombo = isCorrect ? state.combo + 1 : 0
  const lastScore = last(state.scores) || 0
  const isCriteriaChange = newCombo >= CRITERIA_CHANGE_THRESHOLD
  return {
    ...state,
    round,
    criteriaChanges: isCriteriaChange
      ? [...state.criteriaChanges, round]
      : state.criteriaChanges,
    criteriaTrumpIndex: isCriteriaChange
      ? state.criteriaTrumpIndex + 1
      : state.criteriaTrumpIndex,
    combo: isCriteriaChange ? 0 : newCombo,
    scores: [
      ...state.scores,
      isCorrect ? lastScore + SCORE_WIN : lastScore + SCORE_LOSE,
    ],
    scoresPerRound: [
      ...state.scoresPerRound,
      isCorrect ? SCORE_WIN : SCORE_LOSE,
    ],
  }
}

export default game
