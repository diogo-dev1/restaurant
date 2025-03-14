"use client";
import { Prisma } from "@prisma/client";
import { ChefHatIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { useContext, useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency } from "@/helpers/formatCurrency";

import { CartContext } from "../../context/cart";
import CartSheet from "./cartSheet";

interface ProductDetailsProps {
  product: Prisma.ProductGetPayload<{
    include: {
      restaurant: {
        select: {
          name: true;
          avatarImageUrl: true;
        };
      };
    };
  }>;
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const { toggleCart, addProduct } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => (prev === 1 ? 1 : prev - 1));
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    addProduct({
      ...product,
      quantity,
    });
    toggleCart();
  };

  return (
    <>
      {/* Container principal ocupando toda a tela */}
      <div className="h-[66vh] flex flex-col">
        {/* Conteúdo que pode rolar */}
        <div className="flex-1 overflow-auto p-6">
          {/* RESTAURANTE */}
          <div className="flex items-center gap-1.5">
            <Image
              src={product.restaurant.avatarImageUrl}
              alt={product.restaurant.name}
              width={16}
              height={16}
              className="rounded-full"
            />
            <p className="text-xs text-muted-foreground">{product.restaurant.name}</p>
          </div>
          {/* NOME DO PRODUTO */}
          <h2 className="mt-1 text-xl font-semibold">{product.name}</h2>
          {/* PREÇO E QUANTIDADE */}
          <div className="mt-3 flex items-center justify-between">
            <h3 className="text-xl font-semibold">{formatCurrency(product.price)}</h3>
            <div className="flex items-center gap-3 text-center">
              <Button variant="outline" className="h-8 w-8 rounded-xl" onClick={handleDecreaseQuantity}>
                <ChevronLeftIcon />
              </Button>
              <p className="w-4">{quantity}</p>
              <Button variant="destructive" className="h-8 w-8 rounded-xl" onClick={handleIncreaseQuantity}>
                <ChevronRightIcon />
              </Button>
            </div>
          </div>
          {/* SOBRE */}
          <ScrollArea className="mt-6">
            <div className="space-y-3">
              <h4 className="font-semibold">Sobre</h4>
              <p className="text-sm text-muted-foreground">{product.description}</p>
            </div>
            {/* INGREDIENTES */}
            <div className="mt-6 space-y-3">
              {product.ingredients.length === 0 ? (<></>):(
              <>
              <div className="flex items-center gap-1">
                <ChefHatIcon size={18} />
                <h4 className="font-semibold">Ingredientes</h4>
              </div>
              <ul className="list-disc px-5 text-sm text-muted-foreground">
                {product.ingredients.map((ingredient) => (
                  <li key={ingredient}>{ingredient}</li>
                ))}
              </ul>
              </>)}
            </div>
          </ScrollArea>
        </div>
        {/* BOTÃO FIXO */}
        <div className="sticky bottom-0 left-0 right-0 bg-white p-4 shadow-lg border-t">
          <Button className="w-full rounded-full" onClick={handleAddToCart}>
            Adicionar à sacola
          </Button>
        </div>
      </div>
      <CartSheet />
    </>
  );
};

export default ProductDetails;
