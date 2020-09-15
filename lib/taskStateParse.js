const _ACTIVE_STATE = 'ACTIVE'
const _PAUSE_STATE = 'PAUSED'
const _FINISHED_STATE = 'FINISHED'

const parse = state => {
  switch (state) {
    case 'active':
      return _ACTIVE_STATE
    case 'pause':
      return _PAUSE_STATE
    case 'finish':
      return _FINISHED_STATE
    default:
      return _ACTIVE_STATE
  }
}

module.exports = parse
