
import './App.css';

import { BrowserRouter, Routes, Route} from 'react-router-dom'

import Landing from './Pages/Landing';
import CreateQuizPage from './Pages/CreateQuizPage';
import TakeQuizPage from './Pages/TakeQuizPage';

import QuizListPage from './Pages/QuizListPage';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Success from './Components/Quiz/Success';
import Analysis from './Components/Quiz/Analysis';


function App() {

  return (
    <div className="App min-h-screen dark:bg-black -z-40">
      
      <BrowserRouter>
      <Header />
      <Routes>
         <Route path='/' element= {<Landing />}/>
         <Route path='/createquiz' element= {<CreateQuizPage />}/>
         <Route path='/success' element= {<Success />}/>
         <Route path='/takequiz' element= {<QuizListPage />}/>
         <Route path='/analysis' element= {<Analysis />}/>
         <Route path='/takequiz/:id' element= {<TakeQuizPage />}/>
      </Routes>
      <Footer />
     
      </BrowserRouter>
      
    </div>
  );
}

export default App;
