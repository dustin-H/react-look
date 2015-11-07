import assignStyles from 'object-assign'
import warn from '../utils/warn'

/**
 * Extracts referenced styles to an elements props
 * @param {Object} props - elements props that will be assigned
 * @param {Object} styles - a valid style object
 */
const extractStyles = (props, styles) => {
  if (props.hasOwnProperty('look')) {
    // Resolve look shortcut _default and map referenced styles
    if (props.look === true) {
      return styles
    }

    let extracted = {}
    // Splits look to resolve multiple looks
    // Reverse to loop backwards in order to resolve with priority
    const lookList = props.look.split(' ').reverse()

    lookList.forEach(look => {
      // Reduce if look is existing otherwise throw a warning
      if (styles.hasOwnProperty(look)) {
        extracted = assignStyles({}, styles[look], extracted)
      } else {
        warn('Provided styles do not include ' + look, styles)

        return false
      }
    })

    return extracted
  }

  return false
}


/**
* This plugin is only for legacy code to support the old syntax
* It also extracts styles attached to Components directly
*/
export default (styles, {Component, element}) => {
  let retStyles = styles

  if (Component.styles) {
    warn('The string syntax look="' + element.props.look + '" within ' + Component._lookScope + ' is deprecated. Please use direct mapping instead. This will be removed in Version 1.0.0.', Component, element)
    retStyles = extractStyles(element.props, Component.styles)
  }

  return retStyles
}