import * as React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { DefaultProvider } from '@client/store/DefaultContext'
import ErrorBoundary from '@client/components/ErrorBoundary/ErrorBoundary'
import MainContainer from '@client/containers/Main'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faImage,
  faHeading,
  faDownload,
  faTrashAlt,
  faPlus,
  faCropAlt,
  faCrop,
  faUndoAlt,
  faRedoAlt,
  faQuestionCircle,
  faTrashRestoreAlt,
  faGlobe,
  faArrowCircleDown,
  faEraser,
  faTimes
} from '@fortawesome/free-solid-svg-icons'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import { EditorProvider } from '@client/store/EditorContext'

library.add(
  faImage,
  faHeading,
  faTwitter,
  faDownload,
  faTrashAlt,
  faPlus,
  faCropAlt,
  faCrop,
  faUndoAlt,
  faRedoAlt,
  faQuestionCircle,
  faTrashRestoreAlt,
  faGlobe,
  faArrowCircleDown,
  faEraser,
  faTimes
)

function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <Router>
        <DefaultProvider>
          <EditorProvider>
            <MainContainer />
          </EditorProvider>
        </DefaultProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App