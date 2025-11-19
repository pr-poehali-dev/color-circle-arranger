import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface FlowerVariant {
  name: string;
  color: string;
  hex: string;
}

interface Flower {
  id: string;
  name: string;
  image: string;
  price: number;
  variants: FlowerVariant[];
}

interface SelectedFlower {
  flower: Flower;
  variant: FlowerVariant;
  count: number;
}

interface Composition {
  id: string;
  flowers: { flower: Flower; variant: FlowerVariant; count: number; position: { x: number; y: number; rotation: number; scale: number } }[];
  price: number;
  style: string;
}

const FLOWERS: Flower[] = [
  { 
    id: 'rose', 
    name: 'Роза', 
    image: 'https://cdn.poehali.dev/projects/08d494a3-fee7-4c49-bbdd-a84ed353bb5d/files/64fae6c0-efa6-4629-b576-591f190272c5.jpg',
    price: 150,
    variants: [
      { name: 'Красная', color: 'red', hex: '#FF1744' },
      { name: 'Розовая', color: 'pink', hex: '#FF6B9D' },
      { name: 'Белая', color: 'white', hex: '#FFF5F5' },
      { name: 'Желтая', color: 'yellow', hex: '#FFD700' },
    ]
  },
  { 
    id: 'tulip', 
    name: 'Тюльпан', 
    image: 'https://cdn.poehali.dev/projects/08d494a3-fee7-4c49-bbdd-a84ed353bb5d/files/6f3fb72b-3483-488d-95c9-e6061a55f833.jpg',
    price: 120,
    variants: [
      { name: 'Розовый', color: 'pink', hex: '#FF69B4' },
      { name: 'Желтый', color: 'yellow', hex: '#FFD700' },
      { name: 'Фиолетовый', color: 'purple', hex: '#9370DB' },
      { name: 'Белый', color: 'white', hex: '#FFF5F5' },
    ]
  },
  { 
    id: 'sunflower', 
    name: 'Подсолнух', 
    image: 'https://cdn.poehali.dev/projects/08d494a3-fee7-4c49-bbdd-a84ed353bb5d/files/2da05619-d733-4f33-8e3c-1371c8646483.jpg',
    price: 100,
    variants: [
      { name: 'Яркий', color: 'yellow', hex: '#FFD700' },
      { name: 'Оранжевый', color: 'orange', hex: '#FFA500' },
    ]
  },
  { 
    id: 'daisy', 
    name: 'Ромашка', 
    image: 'https://cdn.poehali.dev/projects/08d494a3-fee7-4c49-bbdd-a84ed353bb5d/files/8fa87566-9281-42c0-b2b8-383a68369997.jpg',
    price: 80,
    variants: [
      { name: 'Белая', color: 'white', hex: '#FFFFFF' },
      { name: 'Желтая', color: 'yellow', hex: '#FFD700' },
    ]
  },
  { 
    id: 'lily', 
    name: 'Лилия', 
    image: 'https://cdn.poehali.dev/projects/08d494a3-fee7-4c49-bbdd-a84ed353bb5d/files/56f1c728-33c1-4c31-bed0-597c4bcbd88e.jpg',
    price: 180,
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
    variants: [
      { name: 'Фиолетовая', color: 'purple', hex: '#9370DB' },
      { name: 'Белая', color: 'white', hex: '#FFF5F5' },
      { name: 'Розовая', color: 'pink', hex: '#FF69B4' },
    ]
  },
  { 
    id: 'lavender', 
    name: 'Лаванда', 
    image: 'https://cdn.poehali.dev/projects/08d494a3-fee7-4c49-bbdd-a84ed353bb5d/files/b0d8411d-51bd-4e62-ba75-c570daa7a7e3.jpg',
    price: 90,
    variants: [
      { name: 'Фиолетовая', color: 'purple', hex: '#9370DB' },
      { name: 'Светлая', color: 'light-purple', hex: '#B19CD9' },
    ]
  },
  { 
    id: 'peony', 
    name: 'Пион', 
    image: 'https://cdn.poehali.dev/projects/08d494a3-fee7-4c49-bbdd-a84ed353bb5d/files/a430f767-fb81-410c-a066-b0c254cea39e.jpg',
    price: 200,
    variants: [
      { name: 'Розовый', color: 'pink', hex: '#FFB6C1' },
      { name: 'Белый', color: 'white', hex: '#FFF5F5' },
      { name: 'Коралловый', color: 'coral', hex: '#FF6B9D' },
    ]
  },
];

const COMPOSITION_STYLES = ['Классический', 'Романтический', 'Минималистичный', 'Пышный'];

const Index = () => {
  const [selectedFlowers, setSelectedFlowers] = useState<SelectedFlower[]>([]);
  const [compositions, setCompositions] = useState<Composition[]>([]);
  const [selectedComposition, setSelectedComposition] = useState<Composition | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentFlower, setCurrentFlower] = useState<Flower | null>(null);

  const openFlowerDialog = (flower: Flower) => {
    setCurrentFlower(flower);
    setDialogOpen(true);
  };

  const addFlowerWithVariant = (flower: Flower, variant: FlowerVariant) => {
    const existing = selectedFlowers.find(
      sf => sf.flower.id === flower.id && sf.variant.name === variant.name
    );
    
    if (existing) {
      setSelectedFlowers(selectedFlowers.map(sf => 
        sf.flower.id === flower.id && sf.variant.name === variant.name
          ? { ...sf, count: sf.count + 1 }
          : sf
      ));
    } else {
      setSelectedFlowers([...selectedFlowers, { flower, variant, count: 1 }]);
    }
    
    setDialogOpen(false);
  };

  const updateCount = (flowerId: string, variantName: string, delta: number) => {
    setSelectedFlowers(selectedFlowers.map(sf => {
      if (sf.flower.id === flowerId && sf.variant.name === variantName) {
        const newCount = Math.max(0, sf.count + delta);
        return { ...sf, count: newCount };
      }
      return sf;
    }).filter(sf => sf.count > 0));
  };

  const generateCompositions = () => {
    if (selectedFlowers.length === 0) return;

    const newCompositions: Composition[] = [];
    
    for (let styleIdx = 0; styleIdx < Math.min(4, COMPOSITION_STYLES.length); styleIdx++) {
      const style = COMPOSITION_STYLES[styleIdx];
      const flowers: Composition['flowers'] = [];
      
      selectedFlowers.forEach(({ flower, variant, count }) => {
        for (let i = 0; i < count; i++) {
          const angle = (Math.random() * 360);
          const radius = styleIdx === 2 ? 15 + Math.random() * 40 : 20 + Math.random() * 60;
          const x = 50 + Math.cos(angle * Math.PI / 180) * radius;
          const y = 50 + Math.sin(angle * Math.PI / 180) * radius;
          const rotation = Math.random() * 360;
          const scale = styleIdx === 3 ? 0.8 + Math.random() * 0.4 : 0.9 + Math.random() * 0.2;
          
          flowers.push({
            flower,
            variant,
            count: 1,
            position: { x, y, rotation, scale }
          });
        }
      });

      flowers.sort(() => Math.random() - 0.5);

      const price = selectedFlowers.reduce((sum, sf) => sum + (sf.flower.price * sf.count), 0);
      
      newCompositions.push({
        id: `comp-${Date.now()}-${styleIdx}`,
        flowers,
        price,
        style
      });
    }

    setCompositions(newCompositions);
    setSelectedComposition(newCompositions[0]);
  };

  const getTotalPrice = () => {
    return selectedFlowers.reduce((sum, sf) => sum + (sf.flower.price * sf.count), 0);
  };

  const getTotalCount = () => {
    return selectedFlowers.reduce((sum, sf) => sum + sf.count, 0);
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
              <p className="text-muted-foreground mt-2">Создайте идеальный букет с AI-помощником</p>
            </div>
            {selectedFlowers.length > 0 && (
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">{getTotalPrice()} ₽</div>
                <div className="text-sm text-muted-foreground">{getTotalCount()} {getTotalCount() === 1 ? 'цветок' : getTotalCount() < 5 ? 'цветка' : 'цветов'}</div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-[420px_1fr] gap-8">
          <div className="space-y-6">
            <Card className="p-6 bg-card border-border/40 sticky top-24">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Icon name="Flower2" size={24} />
                Каталог цветов
              </h2>
              
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {FLOWERS.map((flower) => (
                  <button
                    key={flower.id}
                    onClick={() => openFlowerDialog(flower)}
                    className="w-full flex items-center gap-4 p-3 rounded-lg border-2 border-border/40 hover:border-primary transition-all hover:scale-105 bg-white group"
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-secondary/10">
                      <img 
                        src={flower.image} 
                        alt={flower.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-foreground">{flower.name}</div>
                      <div className="text-sm text-muted-foreground">{flower.price} ₽</div>
                      <div className="flex gap-1 mt-1">
                        {flower.variants.slice(0, 4).map((variant, idx) => (
                          <div
                            key={idx}
                            className="w-4 h-4 rounded-full border border-border/40"
                            style={{ backgroundColor: variant.hex }}
                          />
                        ))}
                      </div>
                    </div>
                    <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                  </button>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            {selectedFlowers.length === 0 ? (
              <Card className="p-12 text-center bg-card border-border/40">
                <div className="text-6xl mb-4">💐</div>
                <h3 className="text-2xl font-semibold mb-2">Начните создавать букет</h3>
                <p className="text-muted-foreground">Выберите цветы из каталога слева и укажите их цвет</p>
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
                    {selectedFlowers.map(({ flower, variant, count }, idx) => (
                      <div key={`${flower.id}-${variant.name}-${idx}`} className="flex items-center gap-4 p-4 bg-secondary/20 rounded-lg">
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={flower.image} 
                            alt={flower.name}
                            className="w-full h-full object-cover"
                            style={{ filter: `hue-rotate(${variant.color === 'yellow' ? '20deg' : variant.color === 'purple' ? '260deg' : '0deg'})` }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">{flower.name} • {variant.name}</div>
                          <div className="text-sm text-muted-foreground">{flower.price} ₽ × {count} = {flower.price * count} ₽</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => updateCount(flower.id, variant.name, -1)}
                            variant="outline"
                            size="sm"
                          >
                            <Icon name="Minus" size={16} />
                          </Button>
                          <span className="w-8 text-center font-semibold">{count}</span>
                          <Button
                            onClick={() => updateCount(flower.id, variant.name, 1)}
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
                              {comp.flowers.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="absolute"
                                  style={{
                                    left: `${item.position.x}%`,
                                    top: `${item.position.y}%`,
                                    transform: `translate(-50%, -50%) rotate(${item.position.rotation}deg) scale(${item.position.scale})`,
                                    width: '60px',
                                    height: '60px',
                                  }}
                                >
                                  <img 
                                    src={item.flower.image}
                                    alt={item.flower.name}
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
                                {selectedFlowers.map(({ flower, variant, count }, idx) => (
                                  <div key={idx} className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-full overflow-hidden">
                                      <img src={flower.image} alt={flower.name} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-sm">{flower.name} ({variant.name}) × {count}</span>
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
                            {selectedComposition.flowers.map((item, idx) => (
                              <div
                                key={idx}
                                className="absolute transition-all duration-300"
                                style={{
                                  left: `${item.position.x}%`,
                                  top: `${item.position.y}%`,
                                  transform: `translate(-50%, -50%) rotate(${item.position.rotation}deg) scale(${item.position.scale})`,
                                  width: '80px',
                                  height: '80px',
                                }}
                              >
                                <img 
                                  src={item.flower.image}
                                  alt={item.flower.name}
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
          {currentFlower && (
            <>
              <DialogHeader>
                <DialogTitle>{currentFlower.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="w-full aspect-square rounded-lg overflow-hidden bg-secondary/10">
                  <img 
                    src={currentFlower.image} 
                    alt={currentFlower.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-3">Выберите цвет:</p>
                  <div className="grid grid-cols-2 gap-3">
                    {currentFlower.variants.map((variant) => (
                      <button
                        key={variant.name}
                        onClick={() => addFlowerWithVariant(currentFlower, variant)}
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
                <div className="text-sm text-muted-foreground pt-2 border-t">
                  Цена: {currentFlower.price} ₽ за штуку
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
