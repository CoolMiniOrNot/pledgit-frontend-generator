import Generator from 'yeoman-generator'
import { kebabCase, merge } from 'lodash'
const basePath = 'frontend/source'

const mainPrompt = [
  {
    type: 'list',
    name: 'actionType',
    message: 'What do you like to create?',
    choices: [ 'Component', 'Section', 'Module', 'Page' ]
  }, {
    type: 'input',
    name: 'itemName',
    message: 'Provide a name:',
    validate: ( value ) => { return /^[A-Z][a-zA-Z0-9\/]*$/.test( value ) || 'Invalid name.' }
  }
]

const secondaryPrompt = [
  {
    type: 'confirm',
    name: 'includeSCSS',
    message: 'Generate related stylesheet?',
    default: true
  }, {
    type: 'confirm',
    name: 'includeTest',
    message: 'Generate related test?',
    default: true
  }
]

module.exports = class extends Generator {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  prompting() {
    return this.prompt( mainPrompt ).then( props1 => {
      return this.prompt( secondaryPrompt ).then( props2 => {
        this.props = merge( props1, props2 )
      } )
    } )
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  parseData() {
    let _itemName = this.props.itemName
    let _destination = kebabCase( _itemName )
    let _length = 0
    let _folderLevels = ''

    if ( _itemName.indexOf( '/' ) >= 0 ) {
      _itemName = _itemName.split( '/' )
      _length = ( _itemName.length - 1 )
      _folderLevels = Array.from( { length: _length } ).map( () => '../' ).join( '' )
      _destination = _itemName.map( item => kebabCase( item ) ).join( '/' )
      _itemName = _itemName[ _length ]
    }

    return {
      inputName: _itemName,
      kebabCaseName: kebabCase( _itemName ),
      destination: _destination,
      folderLevels: _folderLevels
    }
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  createDefaultItem( kind ) {
    const data = this.parseData()

    this.fs.copyTpl(
      this.templatePath( `${ kind }/${ kind }.js.txt` ),
      this.destinationPath( `${ basePath }/${ kind }s/${ data.destination }/${ data.kebabCaseName }.js` ), {
        name: data.inputName,
        kebabCaseName: data.kebabCaseName,
        folderLevels: data.folderLevels,
        includeSCSS: this.props.includeSCSS
      }
    )

    if ( this.props.includeTest ) {
      this.fs.copyTpl(
        this.templatePath( `${ kind }/${ kind }.test.js.txt` ),
        this.destinationPath( `${ basePath }/${ kind }s/${ data.destination }/${ data.kebabCaseName }.test.js` ), {
          name: data.inputName,
          kebabCaseName: data.kebabCaseName,
          folderLevels: data.folderLevels
        }
      )
    }

    if ( this.props.includeSCSS ) {
      this.fs.copyTpl(
        this.templatePath( `${ kind }/${ kind }.scss.txt` ),
        this.destinationPath( `${ basePath }/${ kind }s/${ data.destination }/${ data.kebabCaseName }.scss` ), {
          name: data.inputName,
          kebabCaseName: data.kebabCaseName,
          folderLevels: data.folderLevels
        }
      )
    }
  }

  writing() {
    const { actionType } = this.props
    this.createDefaultItem( actionType.toLowerCase() )

    //   switch ( actionType ) {
    //     // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    //     case 'Component':
    //       this._createComponent()
    //       break
    //     // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    //     case 'Section':
    //       this._createSection()
    //       break
    //     // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    //     case 'Page':
    //       this._createPage()
    //       break
    //   }

  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
}