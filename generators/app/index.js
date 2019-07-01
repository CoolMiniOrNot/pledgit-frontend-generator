'use strict';
const Generator = require( 'yeoman-generator' );
const kebabCase = require( 'lodash/kebabCase' );
const merge = require( 'lodash/merge' );
const basePath = 'src'

const prompt = [
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
  }, {
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
    return this.prompt( prompt ).then( props => {
      this.props = props
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
      kind: this.props.actionType.toLowerCase(),
      inputName: _itemName,
      kebabCaseName: kebabCase( _itemName ),
      destination: _destination,
      folderLevels: _folderLevels
    }
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  createDefaultItem() {
    const data = this.parseData()
    const kind = data.kind

    console.log( '====================================' )
    console.log( 'kind: ', kind )
    console.log( 'data: ', data )
    console.log( '====================================' )

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
    console.log( '====================================' )
    console.log( 'actionType: ', actionType )
    console.log( '====================================' )
    this.createDefaultItem( this.props )
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
}