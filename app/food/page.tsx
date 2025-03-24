"use client";
import React, { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import RecipeChatbot from "@/botComponent/RecipeChatbot";
import { app, db } from "../../firebase";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { useRouter } from "next/navigation";

interface FoodItem {
  id: number;
  name: string;
  price: number;
  deliveryTime: string;
  protein: number;
  calories: number;
  fat: number;
  carbs: number;
  image: string;
  description: string;
}

interface FirestoreOrder extends Omit<FoodItem, 'id'> {
  id?: string; // Firestore document ID
  orderedAt: Timestamp;
  status: 'pending' | 'delivered' | 'cancelled';
}

interface WeeklyStats {
  week: number;
  protein: number;
  calories: number;
}

interface FoodCardProps {
  food: FoodItem;
}

const foodItems: FoodItem[] = [
  {
    id: 1,
    name: "Grilled Chicken Salad",
    price: 12.99,
    deliveryTime: "20-30 min",
    protein: 32,
    calories: 350,
    fat: 12,
    carbs: 15,
    image: "/chicken-salad.jpg",
    description:
      "Fresh mixed greens topped with grilled chicken breast, cherry tomatoes, cucumber, and balsamic vinaigrette.",
  },
  {
    id: 2,
    name: "Salmon Bowl",
    price: 16.99,
    deliveryTime: "25-35 min",
    protein: 28,
    calories: 440,
    fat: 18,
    carbs: 42,
    image: "/salmon-bowl.jpg",
    description:
      "Grilled salmon served over brown rice with avocado, edamame, and sesame ginger sauce.",
  },
];

const Page = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [orders, setOrders] = useState<FirestoreOrder[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats[]>([]);
  const [showOrderModal, setShowOrderModal] = useState<boolean>(false);

  // Fetch user authentication state
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Fetch user data when userId is available
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const sampleWeeklyStats: WeeklyStats[] = Array.from({ length: 52 }, (_, i) => ({
          week: i + 1,
          protein: Math.random() * 500,
          calories: Math.random() * 3000,
        }));
        setWeeklyStats(sampleWeeklyStats);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]); // Add userId as a dependency

  // Fetch orders when userId is available
  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) return;
      
      try {
        const ordersRef = collection(db, "users", userId, "orders");
        const q = query(ordersRef, orderBy("orderedAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        const fetchedOrders = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            orderedAt: data.orderedAt as Timestamp
          } as FirestoreOrder;
        });
        
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [userId]);

  if (!userId) {
    return <div>Loading...</div>;
  }
  const handleOrderClick = async (food: FoodItem) => {
    try {
      // Omit the id from the food item and create the order data
      const { id, ...foodWithoutId } = food;
      
      const orderData: Omit<FirestoreOrder, 'id'> = {
        ...foodWithoutId,
        orderedAt: Timestamp.now(),
        status: "pending",
      };

      const docRef = await addDoc(collection(db, "users", userId, "orders"), orderData);
      
      // Add the new order to the state with the Firestore document ID
      const newOrder: FirestoreOrder = {
        ...orderData,
        id: docRef.id,
      };
      
      setOrders([newOrder, ...orders]);
      setShowOrderModal(true);
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const FoodCard: React.FC<FoodCardProps> = ({ food }) => (
    <div
      className="glassmorphism rounded-xl p-4 cursor-pointer transform transition-all duration-300 "
      onClick={() => setSelectedFood(food)}
    >
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
          ${food.price}
        </div>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{food.name}</h3>
      <div className="text-sm text-gray-300 space-y-1">
        <p className="flex justify-between">
          <span>Delivery:</span>
          <span>{food.deliveryTime}</span>
        </p>
        <p className="flex justify-between">
          <span>Protein:</span>
          <span>{food.protein}g</span>
        </p>
        <p className="flex justify-between">
          <span>Calories:</span>
          <span>{food.calories} kcal</span>
        </p>
      </div>
    </div>
  );

  const FoodModal: React.FC = () => {
    if (!selectedFood) return null;

    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
        <div className="glassmorphism rounded-xl max-w-lg w-full mx-4">
          <div className="relative">
            <img
              src={selectedFood.image}
              alt={selectedFood.name}
              className="w-full h-56 object-cover rounded-t-xl"
            />
            <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full">
              ${selectedFood.price}
            </div>
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              {selectedFood.name}
            </h2>
            <p className="text-gray-300 mb-6">{selectedFood.description}</p>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="glassmorphism p-4 rounded-lg">
                <p className="text-gray-800 font-bold">
                  Protein: {selectedFood.protein}g
                </p>
                <p className="text-gray-800 font-bold">
                  Calories: {selectedFood.calories} kcal
                </p>
              </div>
              <div className="glassmorphism p-4 rounded-lg">
                <p className="text-gray-800 font-bold">
                  Fat: {selectedFood.fat}g
                </p>
                <p className="text-gray-800 font-bold">
                  Carbs: {selectedFood.carbs}g
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setSelectedFood(null)}
                className="px-6 py-2 rounded-full glassmorphism text-white hover:bg-white/20 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleOrderClick(selectedFood)}
                className="px-6 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Order Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const OrderConfirmationModal: React.FC = () => (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
      <div className="glassmorphism rounded-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-white mb-4">
          Order Placed Successfully!
        </h2>
        <p className="text-gray-300 mb-6">
          Your order has been confirmed and will be delivered soon.
        </p>
        <button
          onClick={() => setShowOrderModal(false)}
          className="w-full px-6 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Gradient backgrounds */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-red-600/30 via-red-500/20 to-transparent blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-red-900/30 via-red-800/20 to-transparent blur-3xl" />

      {/* Main content */}
      <div className="container mx-auto px-4 py-8 relative">
        <Tab.Group>
          <Tab.List className="flex space-x-4 mb-8">
            {["Food Items", "Orders"].map((tab) => (
              <Tab
                key={tab}
                className={({ selected }) =>
                  `px-6 py-2 rounded-full transition-colors ${
                    selected
                      ? "bg-red-600 text-white"
                      : "glassmorphism text-white hover:bg-white/10"
                  }`
                }
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels>
            <Tab.Panel>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {foodItems.map((food) => (
                  <FoodCard key={food.id} food={food} />
                ))}
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    No orders found
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="glassmorphism rounded-xl p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-white text-lg">{order.name}</h3>
                          <p className="text-gray-300 text-sm">
                            Ordered: {order.orderedAt?.toDate().toLocaleString()}
                          </p>
                          <div className="mt-2 space-y-1 text-sm text-gray-300">
                            <p>Protein: {order.protein}g</p>
                            <p>Calories: {order.calories} kcal</p>
                            <p>Price: ${order.price}</p>
                          </div>
                        </div>
                        <div className="ml-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              order.status === "delivered"
                                ? "bg-green-600"
                                : order.status === "cancelled"
                                ? "bg-red-600"
                                : "bg-yellow-600"
                            } text-white`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="glassmorphism rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">
                  Weekly Statistics
                </h2>
                <div className="h-96">
                  <LineChart width={800} height={300} data={weeklyStats}>
                    <XAxis dataKey="week" stroke="#fff" />
                    <YAxis yAxisId="left" stroke="#fff" />
                    <YAxis yAxisId="right" orientation="right" stroke="#fff" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        border: "none",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="protein"
                      stroke="#ef4444"
                      name="Protein (g)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="calories"
                      stroke="#fff"
                      name="Calories"
                    />
                  </LineChart>
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
      <div className=" bg-black relative overflow-hidden">
        {/* Your existing code... */}
        <RecipeChatbot />
      </div>
      {selectedFood && <FoodModal />}
      {showOrderModal && <OrderConfirmationModal />}
    </div>
  );
};

export default Page;
