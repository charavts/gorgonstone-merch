import { useCart } from '../context/CartContext';
import { Product } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

// Import actual product images (for Figma preview only)
import blackTshirtImage from 'figma:asset/79053c01a90868fa6548df901bd39c0a4e193076.png';
import whiteTshirtImage from 'figma:asset/aaa37a14e841ca1f801b5a9897d1eb7726a9b081.png';
import blackHoodieImage from 'figma:asset/90dffb446495063cbd2fbf36f8e462f6eb848d53.png';
import whiteHoodieImage from 'figma:asset/65b98938f8ad70585d70a8936fdf54bf09f8298e.png';
import blackSweatshirtImage from 'figma:asset/85c2e73139efdc49d278122bcee51f840dfa69d2.png';
import logoImage from 'figma:asset/50d624aa13c522bfa22e236365b881e163b313eb.png';

const products: Product[] = [
  {
    id: '1',
    name: 'Black T-shirt Split Stone Face',
    price: 28,
    image: blackTshirtImage,
    stripeUrl: 'https://buy.stripe.com/test_fZu14p84Vd7Oeyk3Of00004'
  },
  {
    id: '2',
    name: 'Medusa Mask T-shirt White',
    price: 28,
    image: whiteTshirtImage,
    stripeUrl: 'https://buy.stripe.com/28E8wQ3yl8hF5476ob2Nq02'
  },
  {
    id: '3',
    name: 'High-Quality Cotton Hoodie Black',
    price: 40,
    image: blackHoodieImage,
    stripeUrl: 'https://buy.stripe.com/3cIaEYecZapN7cf9An2Nq00'
  },
  {
    id: '4',
    name: 'High-Quality Cotton Hoodie White',
    price: 40,
    image: whiteHoodieImage,
    stripeUrl: 'https://buy.stripe.com/cNi00k1qd2XlaordQD2Nq01'
  },
  {
    id: '5',
    name: 'High-Quality Cotton Sweatshirt Black',
    price: 36,
    image: blackSweatshirtImage,
    stripeUrl: 'https://buy.stripe.com/fZu7sMfh37dBdAD8wj2Nq03'
  }
];

export default function Home() {
  const { addToCart } = useCart();

  return (
    <main className="pt-24 pb-8 px-5">
      <div className="flex flex-wrap justify-start gap-6 max-w-7xl mx-auto">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={addToCart}
          />
        ))}
      </div>
      
      {/* Bottom center logo - scrolls with page */}
      <div className="mt-16 mb-8 flex justify-center w-full opacity-80">
        <ImageWithFallback
          src={logoImage}
          alt="Gorgonstone Logo"
          className="w-[450px] max-w-[90vw] h-auto"
        />
      </div>
    </main>
  );
}