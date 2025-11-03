import Header from "../src/assets/components/Header/header.tsx"
import Footer from "../src/assets/components/Footer/footer.tsx"
import CampoForm from "./assets/components/CampoForm/CampoForm.tsx"

function App() {

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#1f1d1d]">
      <Header />
      <CampoForm />
      <Footer />
    </div>  
  )
}

export default App