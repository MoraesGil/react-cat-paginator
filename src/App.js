import CatList from './components/CatList';
import CatContextProvider from './contexts/CatContext';

function App() {
  return (
    <div className="container-xl">
      <div className="table-responsive">
        <div className="table-wrapper">
          <CatContextProvider>
            <CatList />
          </CatContextProvider>
        </div>
      </div>
    </div>

  );
}

export default App;
