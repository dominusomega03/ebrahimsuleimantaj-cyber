
import React, { useState } from 'react';
import { UserProfile, Product } from '../types';
import { ChevronLeft, Trash2, ShoppingBag, CreditCard, Check, ArrowRight } from 'lucide-react';
import { submitToFormspree } from '../utils/formspree';

interface CartProps {
    user: UserProfile;
    cart: string[];
    setCart: React.Dispatch<React.SetStateAction<string[]>>;
    setView: (view: string) => void;
    products: Product[];
}

const Cart: React.FC<CartProps> = ({ user, cart, setCart, setView, products }) => {
    const [step, setStep] = useState(0); // 0: Review, 1: Processing, 2: Success

    const cartItems = cart.map(id => products.find(p => p.id === id)).filter(Boolean) as Product[];
    const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
    const tax = subtotal * 0.16;
    const total = subtotal + tax;

    const removeFromCart = (index: number) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
    };

    const handleCheckout = async () => {
        setStep(1);
        
        // Prepare data for Formspree
        const orderData = {
            _subject: `New Order from ${user.name}`,
            type: 'ECOMMERCE_ORDER',
            customerName: user.name,
            customerLocation: user.location,
            customerTier: user.tier,
            items: cartItems.map(item => `${item.name} (KES ${item.price})`).join(', '),
            subtotal: subtotal,
            tax: tax,
            totalAmount: total,
            orderDate: new Date().toLocaleString()
        };

        // Submit to Formspree
        await submitToFormspree(orderData);

        setTimeout(() => {
            setStep(2);
            setTimeout(() => {
                setCart([]); // Clear cart
            }, 500);
        }, 2000);
    };

    if (step === 2) {
         return (
             <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-fade-in-up">
                 <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-200 dark:shadow-green-900/20">
                     <Check size={48} className="text-green-500" strokeWidth={3} />
                 </div>
                 <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Order Confirmed!</h1>
                 <p className="text-gray-500 dark:text-gray-400 font-medium mb-8 max-w-[250px]">Your premium goods are being prepared for dispatch.</p>
                 <button 
                    onClick={() => setView('marketplace')}
                    className="bg-gray-900 dark:bg-white text-white dark:text-black px-8 py-3 rounded-full font-bold shadow-lg"
                 >
                    Back to Marketplace
                 </button>
             </div>
         )
    }

    if (step === 1) {
        return (
             <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                 <div className="relative mb-8">
                      <div className="w-20 h-20 border-4 border-gray-100 dark:border-gray-800 rounded-full"></div>
                      <div className="w-20 h-20 border-4 border-sky-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                      <CreditCard className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sky-500" size={24} />
                 </div>
                 <h2 className="text-xl font-bold text-gray-900 dark:text-white">Processing Payment...</h2>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Securing your transaction</p>
             </div>
        )
    }

    return (
        <div className="pb-24 pt-6 px-5 max-w-md mx-auto min-h-screen">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => setView('marketplace')} className="bg-white dark:bg-gray-800 p-2.5 rounded-full shadow-sm text-gray-500 dark:text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
                    <ChevronLeft size={20} />
                </button>
                <h1 className="text-2xl font-black text-gray-800 dark:text-white flex items-center gap-2">
                    My Cart <span className="text-sm font-bold bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-400 px-2 py-0.5 rounded-full">{cart.length}</span>
                </h1>
            </div>

            {cartItems.length > 0 ? (
                <>
                    <div className="space-y-4 mb-8">
                        {cartItems.map((item, index) => (
                            <div key={`${item.id}-${index}`} className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-50 dark:border-gray-700 animate-fade-in">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight mb-1">{item.name}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{item.category}</p>
                                    <p className="text-sky-600 dark:text-sky-400 font-black text-sm">KES {item.price.toLocaleString()}</p>
                                </div>
                                <button 
                                    onClick={() => removeFromCart(index)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 fixed bottom-24 left-5 right-5 md:left-auto md:right-auto md:w-[400px]">
                         <div className="space-y-3 mb-6">
                             <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 font-medium">
                                 <span>Subtotal</span>
                                 <span>KES {subtotal.toLocaleString()}</span>
                             </div>
                             <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 font-medium">
                                 <span>Tax (16%)</span>
                                 <span>KES {tax.toLocaleString()}</span>
                             </div>
                             <div className="flex justify-between text-xl font-black text-gray-900 dark:text-white pt-3 border-t border-gray-100 dark:border-gray-700">
                                 <span>Total</span>
                                 <span>KES {total.toLocaleString()}</span>
                             </div>
                         </div>
                         <button 
                            onClick={handleCheckout}
                            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-sky-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
                         >
                             Checkout Now <ArrowRight size={20} />
                         </button>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-[60vh] text-center opacity-60">
                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                        <ShoppingBag size={40} className="text-gray-300 dark:text-gray-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm max-w-[200px] mb-6">Discover elite products to elevate your lifestyle.</p>
                    <button 
                        onClick={() => setView('marketplace')}
                        className="bg-sky-500 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-sky-200 dark:shadow-sky-900"
                    >
                        Go Shopping
                    </button>
                </div>
            )}
        </div>
    );
};

export default Cart;
