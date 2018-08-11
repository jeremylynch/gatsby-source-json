const deepMapKeys = require(`deep-map-keys`)
const log = console.log

// Prefix to use if there is a conflict with key name
const conflictFieldPrefix = `thirdParty_`

// Keys that will conflic with graphql
const restrictedNodeFields = [`id`, `children`, `parent`, `fields`, `internal`]

/**
 * Validate the GraphQL naming convetions & protect specific fields.
 *
 * @param {any} key
 * @returns the valid name
 */
function getValidKey({ key, verbose = false }) {
  let nkey = String(key)
  const NAME_RX = /^[_a-zA-Z][_a-zA-Z0-9]*$/
  let changed = false
  // Replace invalid characters
  if (!NAME_RX.test(nkey)) {
    changed = true
    nkey = nkey.replace(/-|__|:|\.|\s/g, `_`)
  }
  // Prefix if first character isn't a letter.
  if (!NAME_RX.test(nkey.slice(0, 1))) {
    changed = true
    nkey = `${conflictFieldPrefix}${nkey}`
  }
  if (restrictedNodeFields.includes(nkey)) {
    changed = true
    nkey = `${conflictFieldPrefix}${nkey}`.replace(/-|__|:|\.|\s/g, `_`)
  }
  if (changed && verbose)
    log(`Object with key "${key}" breaks GraphQL naming convention. Renamed to "${nkey}"`)

  return nkey
}

exports.getValidKey = getValidKey

// Standardize ids + make sure keys are valid.
exports.standardizeKeys = entities =>
  entities.map(e =>
    deepMapKeys(
      e,
      key => (key === `ID` ? getValidKey({ key: `id` }) : getValidKey({ key }))
    )
)
