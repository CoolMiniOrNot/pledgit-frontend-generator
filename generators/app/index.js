'use strict';
const Generator = require( 'yeoman-generator' );
const kebabCase = require( 'lodash/kebabCase' );

const prompt = [
  {
    type: 'list',
    name: 'itemType',
    message: 'What do you like to create?',
    choices: [ 'Component', 'Section', 'Module', 'Page', 'State' ]
  }, {
    type: 'input',
    name: 'itemName',
    message: 'Provide a name:',
    validate: ( value ) => { return /^[A-Z][a-zA-Z0-9\/]*$/.test( value ) || 'Invalid name.' }
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
    let { itemName, itemType } = this.props
    let destination = kebabCase( itemName )
    let folderLevels = ''

    if ( itemName.indexOf( '/' ) >= 0 ) {
      let folderLevelsLength = 0

      itemName = itemName.split( '/' )
      folderLevelsLength = ( itemName.length - 1 )
      folderLevels = Array.from( { length: folderLevelsLength } ).map( () => '../' ).join( '' )
      destination = itemName.map( item => kebabCase( item ) ).join( '/' )
      itemName = itemName[ folderLevelsLength ]
    }

    return {
      kind: itemType.toLowerCase(),
      inputName: itemName,
      kebabCaseName: kebabCase( itemName ),
      destination: destination,
      folderLevels: folderLevels
    }
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  writing() {
    const data = this.parseData()
    const kind = data.kind
    const basePath = 'src'



    if ( kind == 'state' ) {
      this.fs.copyTpl(
        this.templatePath( `state/state.js.txt` ),
        this.destinationPath( `${ basePath }/context/${ data.kebabCaseName }-state.js` ), {
          name: data.inputName,
          kebabCaseName: data.kebabCaseName,
          folderLevels: data.folderLevels
        }
      )

      return
    }

    this.fs.copyTpl(
      this.templatePath( `${ kind }/${ kind }.js.txt` ),
      this.destinationPath( `${ basePath }/${ kind }s/${ data.destination }/${ data.kebabCaseName }.js` ), {
        name: data.inputName,
        kebabCaseName: data.kebabCaseName,
        folderLevels: data.folderLevels
      }
    )

    this.fs.copyTpl(
      this.templatePath( `${ kind }/${ kind }.test.js.txt` ),
      this.destinationPath( `${ basePath }/${ kind }s/${ data.destination }/${ data.kebabCaseName }.test.js` ), {
        name: data.inputName,
        kebabCaseName: data.kebabCaseName,
        folderLevels: data.folderLevels
      }
    )

    this.fs.copyTpl(
      this.templatePath( `${ kind }/${ kind }.scss.txt` ),
      this.destinationPath( `${ basePath }/${ kind }s/${ data.destination }/${ data.kebabCaseName }.scss` ), {
        name: data.inputName,
        kebabCaseName: data.kebabCaseName,
        folderLevels: data.folderLevels
      }
    )
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
}