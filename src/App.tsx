//? Hooks
import { useState } from "react";
import { useQuery } from "react-query";
//? Components
import { Badge, Drawer, Grid, LinearProgress } from "@mui/material";
import {
   AddShoppingCartOutlined,
   ErrorOutlineTwoTone,
} from "@mui/icons-material";
import Item from "./Item/Item";
import Cart from "./Cart/Cart";
//? Styles
import { Wrapper, StyledButton } from "./App.styles";
//? Types
export type CartItemType = {
   id: number;
   category: string;
   description: string;
   image: string;
   price: number;
   title: string;
   amount: number;
};

const getProducts = async (): Promise<CartItemType[]> => {
   return (await fetch("https://fakestoreapi.com/products")).json();
};

const App = () => {
   const [cartOpen, setCartOpen] = useState(false);
   const [cartItems, setCartItems] = useState([] as CartItemType[]);
   const { data, isLoading, error } = useQuery<CartItemType[]>(
      "products",
      getProducts
   );

   const getTotalItems = (items: CartItemType[]) => {
      return items.reduce((ack: number, item) => ack + item.amount, 0);
   };

   const handleAddToCart = (clickedItem: CartItemType) => {
      debugger
      setCartItems((prev) => {
         // 1. Is the item already added in the cart?
         const isItemInCart = prev.find((item) => item.id === clickedItem.id);
         if (isItemInCart) {
            return prev.map((item) =>
               item.id === clickedItem.id
                  ? { ...item, amount: item.amount + 1 }
                  : item
            );
         }
         // First time the item is added
         return [...prev, { ...clickedItem, amount: 1 }];
      });
   };

   const handleRemoveFromCart = (id: number) => {
      setCartItems((prev) =>
         prev.reduce((ack, item) => {
            if (item.id === id) {
               if (item.amount === 1) {
                  return ack;
               } else {
                  return [...ack, { ...item, amount: item.amount - 1 }];
               }
            } else {
               return [...ack, item];
            }
         }, [] as CartItemType[])
      );
   };

   if (isLoading) {
      return <LinearProgress />;
   }

   if (error) {
      return (
         <h1>
            Something went wrong <ErrorOutlineTwoTone />
            ...
         </h1>
      );
   }

   return (
      <div>
         <Wrapper>
            <Drawer
               anchor="left"
               open={cartOpen}
               onClose={() => setCartOpen(false)}
            >
               <Cart
                  cartItems={cartItems}
                  addToCart={handleAddToCart}
                  removeFromCart={handleRemoveFromCart}
               />
            </Drawer>
            <StyledButton onClick={() => setCartOpen(true)}>
               <Badge badgeContent={getTotalItems(cartItems)} color="error">
                  <AddShoppingCartOutlined />
               </Badge>
            </StyledButton>
            <Grid container spacing={3}>
               {data?.map((item) => (
                  <Grid item key={item.id} xs={12} sm={6} md={4} xl={3}>
                     <Item item={item} handleAddToCart={handleAddToCart}></Item>
                  </Grid>
               ))}
            </Grid>
         </Wrapper>
      </div>
   );
};

export default App;
