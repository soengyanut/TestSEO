import "./App.css";
import { useGetProductsQuery } from "./features/product/productSlice2";
import CardProduct from "./components/card/card-product";
import SkeletonCardProduct from "./components/card/skeleton-card-product";
import SEO from "./components/seo/SEOComponent";

function App() {
  const { data, isLoading } = useGetProductsQuery({
    page: 0, 
    size: 8
  });
  const array = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div>
      {/* implment SEO */}
      <SEO
        title="Home | ODINN"
        description="ODINN is the most popular powerful ecommerce website which servers many Khmer products such as rural area"
        keywords="product, category, ecommerce, khmer-product"
        url="/"
        image="https://opengraph.b-cdn.net/production/images/83f2bab8-df4d-4d74-88bb-c8bb4e2cd40d.png?token=c7is2HlISBKiv8vtc83311MqIn7CmXvWOIG7GM379CU&height=628&width=1200&expires=33290971123"

      />
      <main className="max-w-screen-xl mx-auto">
        <section className="grid grid-cols-4 gap-5">
          {isLoading &&
            array.map((index) => <SkeletonCardProduct key={index} />)}
          {/* product section */}
          {!isLoading &&
            data?.content.map((p, index) => (
              <CardProduct
                key={index}
                thumbnail={p.thumbnail}
                title={p.name}
                id={p.uuid}
              />
            ))}
        </section>
      </main>
    </div>
  );
}

export default App;
