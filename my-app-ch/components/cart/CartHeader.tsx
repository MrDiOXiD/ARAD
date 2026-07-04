import CartBreadcrumb from './CartBreadcrumb';

interface CartHeaderProps {
  itemCount: number;
}

export default function CartHeader({ itemCount }: CartHeaderProps) {
  return (
    <header className="cart-header">
      <CartBreadcrumb />
      <div className="cart-header__title-row">
        <h1 className="cart-header__title">سبد خرید شما</h1>
        <span className="cart-header__badge">{itemCount} کالا</span>
      </div>
    </header>
  );
}
