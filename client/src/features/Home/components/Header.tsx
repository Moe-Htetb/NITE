// Header.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/types/product";
import {
  clearAuthInfo,
  selectAuthInfo,
  refreshAuthFromCookie,
} from "@/store/authSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  Menu,
  ShoppingCart,
  Heart,
  User,
  Package,
  Settings,
  LogOut,
  Home,
  Sparkles,
  TrendingUp,
  BookOpen,
} from "lucide-react";

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const authInfo = useAppSelector(selectAuthInfo);

  const categories = [
    {
      name: "Outdoor Gear",
      items: [
        "Backpacks",
        "Tents & Shelters",
        "Sleeping Bags",
        "Camping Furniture",
      ],
    },
    {
      name: "Hiking & Trekking",
      items: ["Hiking Boots", "Trekking Poles", "Navigation", "Hydration"],
    },
    {
      name: "Clothing",
      items: ["Jackets & Vests", "Base Layers", "Hiking Pants", "Footwear"],
    },
    {
      name: "Accessories",
      items: ["Headlamps", "Water Bottles", "Multi-tools", "First Aid"],
    },
  ];

  const userMenu = [
    { name: "My Profile", icon: User, onClick: () => navigate("/profile") },
    { name: "Orders", icon: Package, onClick: () => navigate("/orders") },
    { name: "Wishlist", icon: Heart, onClick: () => navigate("/wishlist") },
    { name: "Settings", icon: Settings, onClick: () => navigate("/settings") },
  ];

  // This useEffect ensures the component is mounted before accessing localStorage/cookies
  useEffect(() => {
    setMounted(true);
    dispatch(refreshAuthFromCookie());
  }, [dispatch]);

  // Handle sign out
  const handleSignOut = () => {
    dispatch(clearAuthInfo());
    navigate("/");
  };

  const getInitials = (name?: string) => {
    if (!name) return "US";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Skeleton loader */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200"></div>
            <div className="h-6 w-32 animate-pulse rounded bg-gray-200"></div>
          </div>
          <div className="h-10 w-24 animate-pulse rounded bg-gray-200"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-cyan-500">
              <span className="text-lg font-bold text-white">W</span>
            </div>
            <span className="text-2xl font-bold bg-linear-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              WanderShop
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/"
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-active:bg-accent/50 data-[state=open]:bg-accent/50"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex items-center gap-1">
                  Categories
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-100 gap-3 p-4 md:w-125 md:grid-cols-2 lg:w-150">
                    {categories.map((category) => (
                      <div key={category.name}>
                        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                          {category.name}
                        </h3>
                        <ul className="space-y-1">
                          {category.items.map((item) => (
                            <li key={item}>
                              <NavigationMenuLink asChild>
                                <a
                                  href="#"
                                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                >
                                  <div className="text-sm font-medium leading-none">
                                    {item}
                                  </div>
                                </a>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="#"
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-active:bg-accent/50 data-[state=open]:bg-accent/50"
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Deals
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="#"
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-active:bg-accent/50 data-[state=open]:bg-accent/50"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    New Arrivals
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="#"
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-active:bg-accent/50 data-[state=open]:bg-accent/50"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Stories
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Desktop Search and Actions */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Search */}
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search gear & destinations..."
              className="pl-9 rounded-full"
            />
          </div>

          {/* Wishlist */}
          <Button variant="ghost" size="icon" className="relative">
            <Heart className="h-5 w-5" />
            <Badge className="absolute -right-1 -top-1 h-5 w-5 justify-center rounded-full p-0 text-xs">
              2
            </Badge>
          </Button>

          {/* Cart */}
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <Badge className="absolute -right-1 -top-1 h-5 w-5 justify-center rounded-full p-0 text-xs bg-linear-to-r from-emerald-500 to-cyan-500">
              3
            </Badge>
          </Button>

          {/* User Account */}
          {authInfo ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-linear-to-br from-emerald-500 to-cyan-500 text-white">
                      {getInitials(authInfo.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {authInfo.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {authInfo.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {userMenu.map((item) => (
                  <DropdownMenuItem
                    key={item.name}
                    className="cursor-pointer"
                    onClick={item.onClick}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="ghost">
              <Link to="/login">Sign In</Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="flex lg:hidden items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Heart className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <Badge className="absolute -right-1 -top-1 h-5 w-5 justify-center rounded-full p-0 text-xs bg-linear-to-r from-emerald-500 to-cyan-500">
              3
            </Badge>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] sm:w-100">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-cyan-500">
                      <span className="text-lg font-bold text-white">W</span>
                    </div>
                    <span className="text-xl font-bold bg-linear-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                      WanderShop
                    </span>
                  </div>
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Mobile Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    className="pl-9 rounded-full"
                  />
                </div>

                <Separator />

                {/* Mobile Navigation */}
                <nav className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link to="/" className="flex items-center">
                      <Home className="mr-2 h-4 w-4" />
                      Home
                    </Link>
                  </Button>

                  <Accordion type="single" collapsible>
                    <AccordionItem value="categories" className="border-none">
                      <AccordionTrigger className="py-2 hover:no-underline">
                        <div className="flex items-center">Categories</div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pl-4">
                          {categories.flatMap((category) =>
                            category.items.map((item) => (
                              <Button
                                key={item}
                                variant="ghost"
                                className="w-full justify-start text-sm"
                                asChild
                              >
                                <a href="#">{item}</a>
                              </Button>
                            ))
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <a href="#" className="flex items-center">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Deals
                    </a>
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <a href="#" className="flex items-center">
                      <Sparkles className="mr-2 h-4 w-4" />
                      New Arrivals
                    </a>
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <a href="#" className="flex items-center">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Stories
                    </a>
                  </Button>
                </nav>

                <Separator />

                {/* Mobile User Actions */}
                {authInfo ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-linear-to-br from-emerald-500 to-cyan-500 text-white">
                          {getInitials(authInfo.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{authInfo.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {authInfo.email}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {userMenu.slice(0, 3).map((item) => (
                        <Button
                          key={item.name}
                          variant="outline"
                          className="h-auto flex-col gap-1 py-3"
                          size="sm"
                          onClick={item.onClick}
                        >
                          <item.icon className="h-4 w-4" />
                          <span className="text-xs">{item.name}</span>
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button className="w-full" asChild>
                      <Link to="/login">Sign In</Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/register">Create Account</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
