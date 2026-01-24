import { Layout } from "@shared/components/Layout";
import { Contexts } from "@shared/contexts";
import { Providers } from "@shared/providers";
import { Routing } from "@shared/routes/Routing";
import { Styles } from "@shared/styles";
import { BrowserRouter } from "react-router-dom";

export function App() {
  return (
    <>
      <BrowserRouter>
        <Providers>
          <Contexts>
            <Layout>
              <Routing />

              <Styles />
            </Layout>
          </Contexts>
        </Providers>
      </BrowserRouter>
    </>
  );
}

export default App;
