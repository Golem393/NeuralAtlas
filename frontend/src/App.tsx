import BuildingsList from './components/BuildingsList'

function App() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-8">
      <h1 className="text-4xl font-bold mb-2">NeuralAtlas</h1>
      <p className="text-gray-400 mb-8">3D Geospatial Visualization Platform</p>
      <BuildingsList />
    </div>
  )
}

export default App
