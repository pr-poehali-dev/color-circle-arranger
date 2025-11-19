import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface FlowerVariant {
  name: string;
  color: string;
  hex: string;
}

interface Item {
  id: string;
  name: string;
  image: string;
  price: number;
  category: 'focal' | 'secondary' | 'filler';
  variants?: FlowerVariant[];
}

interface SelectedItem {
  item: Item;
  variant?: FlowerVariant;
  count: number;
}

interface Composition {
  id: string;
  items: { item: Item; variant?: FlowerVariant; count: number; position: { x: number; y: number; rotation: number; scale: number; layer: number } }[];
  price: number;
  style: string;
}

const FOCAL_FLOWERS: Item[] = [
  { 
    id: 'rose', 
    name: 'Роза', 
    image: 'https://cdn.poehali.dev/projects/08d494a3-fee7-4c49-bbdd-a84ed353bb5d/files/64fae6c0-efa6-4629-b576-591f190272c5.jpg',
    price: 150,
    category: 'focal',
    variants: [
      { name: 'Красная', color: 'red', hex: '#FF1744' },
      { name: 'Розовая', color: 'pink', hex: '#FF6B9D' },
      { name: 'Белая', color: 'white', hex: '#FFF5F5' },
      { name: 'Желтая', color: 'yellow', hex: '#FFD700' },
    ]
  },
  { 
    id: 'lily', 
    name: 'Лилия', 
    image: 'https://cdn.poehali.dev/projects/08d494a3-fee7-4c49-bbdd-a84ed353bb5d/files/56f1c728-33c1-4c31-bed0-597c4bcbd88e.jpg',
    price: 180,
    category: 'focal',
    variants: [
      { name: 'Розовая', color: 'pink', hex: '#FF69B4' },
      { name: 'Белая', color: 'white', hex: '#FFF5F5' },
      { name: 'Оранжевая', color: 'orange', hex: '#FF4500' },
    ]
  },
  { 
    id: 'orchid', 
    name: 'Орхидея', 
    image: 'https://cdn.poehali.dev/projects/08d494a3-fee7-4c49-bbdd-a84ed353bb5d/files/6f026fbd-4aae-4310-a169-707b90a6e36a.jpg',
    price: 250,
    category: 'focal',
    variants: [
      { name: 'Фиолетовая', color: 'purple', hex: '#9370DB' },
      { name: 'Белая', color: 'white', hex: '#FFF5F5' },
      { name: 'Розовая', color: 'pink', hex: '#FF69B4' },
    ]
  },
  { 
    id: 'peony', 
    name: 'Пион', 
    image: 'https://cdn.poehali.dev/projects/08d494a3-fee7-4c49-bbdd-a84ed353bb5d/files/a430f767-fb81-410c-a066-b0c254cea39e.jpg',
    price: 200,
    category: 'focal',
    variants: [
      { name: 'Розовый', color: 'pink', hex: '#FFB6C1' },
      { name: 'Белый', color: 'white', hex: '#FFF5F5' },
      { name: 'Коралловый', color: 'coral', hex: '#FF6B9D' },
    ]
  },
  { 
    id: 'sunflower', 
    name: 'Подсолнух', 
    image: 'https://cdn.poehali.dev/projects/08d494a3-fee7-4c49-bbdd-a84ed353bb5d/files/2da05619-d733-4f33-8e3c-1371c8646483.jpg',
    price: 100,
    category: 'focal',
    variants: [
      { name: 'Яркий', color: 'yellow', hex: '#FFD700' },
      { name: 'Оранжевый', color: 'orange', hex: '#FFA500' },
    ]
  },
];

const SECONDARY_FLOWERS: Item[] = [
  { 
    id: 'tulip', 
    name: 'Тюльпан', 
    image: 'https://cdn.poehali.dev/projects/08d494a3-fee7-4c49-bbdd-a84ed353bb5d/files/6f3fb72b-3483-488d-95c9-e6061a55f833.jpg',
    price: 120,
    category: 'secondary',
    variants: [
      { name: 'Розовый', color: 'pink', hex: '#FF69B4' },
      { name: 'Желтый', color: 'yellow', hex: '#FFD700' },
      { name: 'Фиолетовый', color: 'purple', hex: '#9370DB' },
      { name: 'Белый', color: 'white', hex: '#FFF5F5' },
    ]
  },
  { 
    id: 'daisy', 
    name: 'Ромашка', 
    image: 'https://cdn.poehali.dev/projects/08d494a3-fee7-4c49-bbdd-a84ed353bb5d/files/8fa87566-9281-42c0-b2b8-383a68369997.jpg',
    price: 80,
    category: 'secondary',
    variants: [
      { name: 'Белая', color: 'white', hex: '#FFFFFF' },
      { name: 'Желтая', color: 'yellow', hex: '#FFD700' },
    ]
  },
  { 
    id: 'lavender', 
    name: 'Лаванда', 
    image: 'https://cdn.poehali.dev/projects/08d494a3-fee7-4c49-bbdd-a84ed353bb5d/files/b0d8411d-51bd-4e62-ba75-c570daa7a7e3.jpg',
    price: 90,
    category: 'secondary',
    variants: [
      { name: 'Фиолетовая', color: 'purple', hex: '#9370DB' },
      { name: 'Светлая', color: 'light-purple', hex: '#B19CD9' },
    ]
  },
];

const FILLERS: Item[] = [
  { 
    id: 'eucalyptus', 
    name: 'Эвкалипт', 
    image: 'https://cdn.poehali.dev/projects/08d494a3-fee7-4c49-bbdd-a84ed353bb5d/files/f0cfb0a4-5c74-4477-ac73-9fe1d9043acd.jpg',
    price: 50,
    category: 'filler',
  },
  { 
    id: 'wheat', 
    name: 'Колосья пшеницы', 
    image: 'https://cdn.poehali.dev/projects/08d494a3-fee7-4c49-bbdd-a84ed353bb5d/files/b631ff89-1ba1-43c3-b60a-f3e48b9ef7e5.jpg',
    price: 40,
    category: 'filler',
  },
  { 
    id: 'gypsophila', 
    name: 'Гипсофила', 
    image: 'https://cdn.poehali.dev/projects/08d494a3-fee7-4c49-bbdd-a84ed353bb5d/files/b0eca2e8-c51c-40a4-9204-bf8b2c05275f.jpg',
    price: 60,
    category: 'filler',
  },
  { 
    id: 'fern', 
    name: 'Папоротник', 
    image: 'https://cdn.poehali.dev/projects/08d494a3-fee7-4c49-bbdd-a84ed353bb5d/files/dee256da-1df6-46ef-bbc8-355189d20d9d.jpg',
    price: 45,
    category: 'filler',
  },
];

const COMPOSITION_STYLES = ['Классический', 'Романтический', 'Минималистичный', 'Пышный'];

const Index = () => {
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [compositions, setCompositions] = useState<Composition[]>([]);
  const [selectedComposition, setSelectedComposition] = useState<Composition | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);

  const openItemDialog = (item: Item) => {
    setCurrentItem(item);
    setDialogOpen(true);
  };

  const addItemWithVariant = (item: Item, variant?: FlowerVariant) => {
    const existing = selectedItems.find(
      si => si.item.id === item.id && si.variant?.name === variant?.name
    );
    
    if (existing) {
      setSelectedItems(selectedItems.map(si => 
        si.item.id === item.id && si.variant?.name === variant?.name
          ? { ...si, count: si.count + 1 }
          : si
      ));
    } else {
      setSelectedItems([...selectedItems, { item, variant, count: 1 }]);
    }
    
    setDialogOpen(false);
  };

  const updateCount = (itemId: string, variantName: string | undefined, delta: number) => {
    setSelectedItems(selectedItems.map(si => {
      if (si.item.id === itemId && si.variant?.name === variantName) {
        const newCount = Math.max(0, si.count + delta);
        return { ...si, count: newCount };
      }
      return si;
    }).filter(si => si.count > 0));
  };

  const generateCompositions = () => {
    if (selectedItems.length === 0) return;

    const newCompositions: Composition[] = [];
    
    for (let styleIdx = 0; styleIdx < Math.min(4, COMPOSITION_STYLES.length); styleIdx++) {
      const style = COMPOSITION_STYLES[styleIdx];
      const items: Composition['items'] = [];
      
      selectedItems.forEach(({ item, variant, count }) => {
        for (let i = 0; i < count; i++) {
          let angle, radius, scale, layer;
          
          if (item.category === 'focal') {
            angle = (Math.random() * 360);
            radius = styleIdx === 2 ? 10 + Math.random() * 30 : 15 + Math.random() * 35;
            scale = 1.0 + Math.random() * 0.3;
            layer = 3;
          } else if (item.category === 'secondary') {
            angle = (Math.random() * 360);
            radius = 25 + Math.random() * 45;
            scale = 0.7 + Math.random() * 0.2;
            layer = 2;
          } else {
            angle = (Math.random() * 360);
            radius = 35 + Math.random() * 55;
            scale = 0.5 + Math.random() * 0.2;
            layer = 1;
          }
          
          const x = 50 + Math.cos(angle * Math.PI / 180) * radius;
          const y = 50 + Math.sin(angle * Math.PI / 180) * radius;
          const rotation = Math.random() * 360;
          
          items.push({
            item,
            variant,
            count: 1,
            position: { x, y, rotation, scale, layer }
          });
        }
      });

      items.sort((a, b) => a.position.layer - b.position.layer);

      const price = selectedItems.reduce((sum, si) => sum + (si.item.price * si.count), 0);
      
      newCompositions.push({
        id: `comp-${Date.now()}-${styleIdx}`,
        items,
        price,
        style
      });
    }

    setCompositions(newCompositions);
    setSelectedComposition(newCompositions[0]);
  };

  const getTotalPrice = () => {
    return selectedItems.reduce((sum, si) => sum + (si.item.price * si.count), 0);
  };

  const getTotalCount = () => {
    return selectedItems.reduce((sum, si) => sum + si.count, 0);
  };

  const getCategoryBadge = (category: string) => {
    switch(category) {
      case 'focal': return <Badge variant="default" className="text-xs">Фокальный</Badge>;
      case 'secondary': return <Badge variant="secondary" className="text-xs">Второстепенный</Badge>;
      case 'filler': return <Badge variant="outline" className="text-xs">Дополнение</Badge>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-10 bg-background/95">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-primary flex items-center gap-3">
                <span>🌸</span>
                Букет Мечты
              </h1>
              <p className="text-muted-foreground mt-2">Профессиональная флористика с AI-дизайном</p>
            </div>
            {selectedItems.length > 0 && (
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">{getTotalPrice()} ₽</div>
                <div className="text-sm text-muted-foreground">{getTotalCount()} {getTotalCount() === 1 ? 'элемент' : getTotalCount() < 5 ? 'элемента' : 'элементов'}</div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-[450px_1fr] gap-8">
          <div className="space-y-6">
            <Card className="p-6 bg-card border-border/40 sticky top-24">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Icon name="Flower2" size={24} />
                Каталог
              </h2>
              
              <Tabs defaultValue="focal" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="focal">Фокальные</TabsTrigger>
                  <TabsTrigger value="secondary">Второстепенные</TabsTrigger>
                  <TabsTrigger value="filler">Дополнения</TabsTrigger>
                </TabsList>
                
                <TabsContent value="focal" className="space-y-3 max-h-[500px] overflow-y-auto pr-2 mt-4">
                  {FOCAL_FLOWERS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => openItemDialog(item)}
                      className="w-full flex items-center gap-4 p-3 rounded-lg border-2 border-border/40 hover:border-primary transition-all hover:scale-105 bg-white group"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-secondary/10">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-foreground flex items-center gap-2">
                          {item.name}
                          {getCategoryBadge(item.category)}
                        </div>
                        <div className="text-sm text-muted-foreground">{item.price} ₽</div>
                        {item.variants && (
                          <div className="flex gap-1 mt-1">
                            {item.variants.slice(0, 4).map((variant, idx) => (
                              <div
                                key={idx}
                                className="w-4 h-4 rounded-full border border-border/40"
                                style={{ backgroundColor: variant.hex }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                    </button>
                  ))}
                </TabsContent>
                
                <TabsContent value="secondary" className="space-y-3 max-h-[500px] overflow-y-auto pr-2 mt-4">
                  {SECONDARY_FLOWERS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => openItemDialog(item)}
                      className="w-full flex items-center gap-4 p-3 rounded-lg border-2 border-border/40 hover:border-primary transition-all hover:scale-105 bg-white group"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-secondary/10">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-foreground flex items-center gap-2">
                          {item.name}
                          {getCategoryBadge(item.category)}
                        </div>
                        <div className="text-sm text-muted-foreground">{item.price} ₽</div>
                        {item.variants && (
                          <div className="flex gap-1 mt-1">
                            {item.variants.slice(0, 4).map((variant, idx) => (
                              <div
                                key={idx}
                                className="w-4 h-4 rounded-full border border-border/40"
                                style={{ backgroundColor: variant.hex }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                    </button>
                  ))}
                </TabsContent>
                
                <TabsContent value="filler" className="space-y-3 max-h-[500px] overflow-y-auto pr-2 mt-4">
                  {FILLERS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => addItemWithVariant(item)}
                      className="w-full flex items-center gap-4 p-3 rounded-lg border-2 border-border/40 hover:border-primary transition-all hover:scale-105 bg-white group"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-secondary/10">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-foreground flex items-center gap-2">
                          {item.name}
                          {getCategoryBadge(item.category)}
                        </div>
                        <div className="text-sm text-muted-foreground">{item.price} ₽</div>
                      </div>
                      <Icon name="Plus" size={20} className="text-primary" />
                    </button>
                  ))}
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          <div className="space-y-6">
            {selectedItems.length === 0 ? (
              <Card className="p-12 text-center bg-card border-border/40">
                <div className="text-6xl mb-4">💐</div>
                <h3 className="text-2xl font-semibold mb-2">Создайте свой букет</h3>
                <p className="text-muted-foreground mb-4">Выберите фокальные цветы, добавьте второстепенные и зелень</p>
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto text-left">
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <div className="text-2xl mb-1">🌹</div>
                    <div className="text-xs font-medium">Фокальные</div>
                    <div className="text-xs text-muted-foreground">Основа букета</div>
                  </div>
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <div className="text-2xl mb-1">🌼</div>
                    <div className="text-xs font-medium">Второстепенные</div>
                    <div className="text-xs text-muted-foreground">Дополнение</div>
                  </div>
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <div className="text-2xl mb-1">🌿</div>
                    <div className="text-xs font-medium">Декор</div>
                    <div className="text-xs text-muted-foreground">Зелень</div>
                  </div>
                </div>
              </Card>
            ) : (
              <>
                <Card className="p-6 bg-card border-border/40">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Ваш выбор</h2>
                    <Button onClick={generateCompositions} size="lg">
                      <Icon name="Wand2" size={20} className="mr-2" />
                      Сгенерировать букеты
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {selectedItems.map(({ item, variant, count }, idx) => (
                      <div key={`${item.id}-${variant?.name || 'no-variant'}-${idx}`} className="flex items-center gap-4 p-4 bg-secondary/20 rounded-lg">
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold flex items-center gap-2">
                            {item.name} {variant && `• ${variant.name}`}
                            {getCategoryBadge(item.category)}
                          </div>
                          <div className="text-sm text-muted-foreground">{item.price} ₽ × {count} = {item.price * count} ₽</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => updateCount(item.id, variant?.name, -1)}
                            variant="outline"
                            size="sm"
                          >
                            <Icon name="Minus" size={16} />
                          </Button>
                          <span className="w-8 text-center font-semibold">{count}</span>
                          <Button
                            onClick={() => updateCount(item.id, variant?.name, 1)}
                            variant="outline"
                            size="sm"
                          >
                            <Icon name="Plus" size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {compositions.length > 0 && (
                  <>
                    <Card className="p-6 bg-card border-border/40">
                      <h2 className="text-xl font-semibold mb-4">Варианты композиций</h2>
                      <div className="grid md:grid-cols-2 gap-4">
                        {compositions.map((comp) => (
                          <button
                            key={comp.id}
                            onClick={() => setSelectedComposition(comp)}
                            className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                              selectedComposition?.id === comp.id
                                ? 'border-primary ring-2 ring-primary/20'
                                : 'border-border/40'
                            }`}
                          >
                            <div className="relative aspect-square bg-gradient-to-br from-secondary/20 to-accent/20 rounded-lg mb-3 overflow-hidden">
                              {comp.items.map((compItem, idx) => (
                                <div
                                  key={idx}
                                  className="absolute"
                                  style={{
                                    left: `${compItem.position.x}%`,
                                    top: `${compItem.position.y}%`,
                                    transform: `translate(-50%, -50%) rotate(${compItem.position.rotation}deg) scale(${compItem.position.scale})`,
                                    width: '60px',
                                    height: '60px',
                                    zIndex: compItem.position.layer,
                                  }}
                                >
                                  <img 
                                    src={compItem.item.image}
                                    alt={compItem.item.name}
                                    className="w-full h-full object-cover rounded-full"
                                  />
                                </div>
                              ))}
                            </div>
                            <Badge variant="secondary" className="mb-2">{comp.style}</Badge>
                            <div className="font-semibold text-lg">{comp.price} ₽</div>
                          </button>
                        ))}
                      </div>
                    </Card>

                    {selectedComposition && (
                      <Card className="p-8 bg-card border-border/40">
                        <div className="grid md:grid-cols-2 gap-8">
                          <div>
                            <h3 className="text-2xl font-semibold mb-4">{selectedComposition.style} букет</h3>
                            <div className="space-y-4">
                              <div>
                                <div className="text-sm text-muted-foreground mb-2">Состав:</div>
                                {selectedItems.map(({ item, variant, count }, idx) => (
                                  <div key={idx} className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-full overflow-hidden">
                                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-sm">{item.name} {variant && `(${variant.name})`} × {count}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="pt-4 border-t border-border/40">
                                <div className="flex justify-between items-center mb-4">
                                  <span className="text-muted-foreground">Итого:</span>
                                  <span className="text-3xl font-bold text-primary">{selectedComposition.price} ₽</span>
                                </div>
                                <Button className="w-full" size="lg">
                                  <Icon name="ShoppingCart" size={20} className="mr-2" />
                                  Заказать букет
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="relative aspect-square bg-gradient-to-br from-secondary/20 to-accent/20 rounded-lg overflow-hidden">
                            {selectedComposition.items.map((compItem, idx) => (
                              <div
                                key={idx}
                                className="absolute transition-all duration-300"
                                style={{
                                  left: `${compItem.position.x}%`,
                                  top: `${compItem.position.y}%`,
                                  transform: `translate(-50%, -50%) rotate(${compItem.position.rotation}deg) scale(${compItem.position.scale})`,
                                  width: '90px',
                                  height: '90px',
                                  zIndex: compItem.position.layer,
                                }}
                              >
                                <img 
                                  src={compItem.item.image}
                                  alt={compItem.item.name}
                                  className="w-full h-full object-cover rounded-full shadow-lg"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          {currentItem && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {currentItem.name}
                  {getCategoryBadge(currentItem.category)}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="w-full aspect-square rounded-lg overflow-hidden bg-secondary/10">
                  <img 
                    src={currentItem.image} 
                    alt={currentItem.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {currentItem.variants ? (
                  <div>
                    <p className="text-sm text-muted-foreground mb-3">Выберите цвет:</p>
                    <div className="grid grid-cols-2 gap-3">
                      {currentItem.variants.map((variant) => (
                        <button
                          key={variant.name}
                          onClick={() => addItemWithVariant(currentItem, variant)}
                          className="flex items-center gap-3 p-3 rounded-lg border-2 border-border/40 hover:border-primary transition-all hover:scale-105 bg-white"
                        >
                          <div
                            className="w-8 h-8 rounded-full border-2 border-border/40"
                            style={{ backgroundColor: variant.hex }}
                          />
                          <span className="font-medium">{variant.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Button 
                    onClick={() => addItemWithVariant(currentItem)}
                    className="w-full"
                    size="lg"
                  >
                    <Icon name="Plus" size={20} className="mr-2" />
                    Добавить в букет
                  </Button>
                )}
                <div className="text-sm text-muted-foreground pt-2 border-t">
                  Цена: {currentItem.price} ₽ за штуку
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
