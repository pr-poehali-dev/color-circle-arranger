import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Flower {
  id: string;
  name: string;
  emoji: string;
  price: number;
  colors: string[];
}

interface SelectedFlower {
  flower: Flower;
  count: number;
}

interface Composition {
  id: string;
  flowers: { flower: Flower; count: number; position: { x: number; y: number; rotation: number } }[];
  price: number;
  style: string;
}

const FLOWERS: Flower[] = [
  { id: 'rose', name: 'Роза', emoji: '🌹', price: 150, colors: ['#FF6B9D', '#FF1744', '#FFC1E3'] },
  { id: 'tulip', name: 'Тюльпан', emoji: '🌷', price: 120, colors: ['#FF6B9D', '#FFD700', '#9370DB'] },
  { id: 'sunflower', name: 'Подсолнух', emoji: '🌻', price: 100, colors: ['#FFD700', '#FFA500'] },
  { id: 'daisy', name: 'Ромашка', emoji: '🌼', price: 80, colors: ['#FFFFFF', '#FFD700'] },
  { id: 'lily', name: 'Лилия', emoji: '🌺', price: 180, colors: ['#FF69B4', '#FFFFFF', '#FF1744'] },
  { id: 'orchid', name: 'Орхидея', emoji: '🌸', price: 250, colors: ['#DDA0DD', '#FFFFFF', '#FF69B4'] },
  { id: 'lavender', name: 'Лаванда', emoji: '💐', price: 90, colors: ['#9370DB', '#8A84E2'] },
  { id: 'peony', name: 'Пион', emoji: '🏵️', price: 200, colors: ['#FFB6C1', '#FF69B4', '#FFFFFF'] },
];

const COMPOSITION_STYLES = ['Классический', 'Романтический', 'Минималистичный', 'Пышный'];

const Index = () => {
  const [selectedFlowers, setSelectedFlowers] = useState<SelectedFlower[]>([]);
  const [compositions, setCompositions] = useState<Composition[]>([]);
  const [selectedComposition, setSelectedComposition] = useState<Composition | null>(null);

  const addFlower = (flower: Flower) => {
    const existing = selectedFlowers.find(sf => sf.flower.id === flower.id);
    if (existing) {
      setSelectedFlowers(selectedFlowers.map(sf => 
        sf.flower.id === flower.id ? { ...sf, count: sf.count + 1 } : sf
      ));
    } else {
      setSelectedFlowers([...selectedFlowers, { flower, count: 1 }]);
    }
  };

  const updateCount = (flowerId: string, delta: number) => {
    setSelectedFlowers(selectedFlowers.map(sf => {
      if (sf.flower.id === flowerId) {
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
      
      selectedFlowers.forEach(({ flower, count }) => {
        for (let i = 0; i < count; i++) {
          const angle = (Math.random() * 360);
          const radius = 20 + Math.random() * 60;
          const x = 50 + Math.cos(angle * Math.PI / 180) * radius;
          const y = 50 + Math.sin(angle * Math.PI / 180) * radius;
          const rotation = Math.random() * 360;
          
          flowers.push({
            flower,
            count: 1,
            position: { x, y, rotation }
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
        <div className="grid lg:grid-cols-[400px_1fr] gap-8">
          <div className="space-y-6">
            <Card className="p-6 bg-card border-border/40 sticky top-24">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Icon name="Flower2" size={24} />
                Выберите цветы
              </h2>
              
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {FLOWERS.map((flower) => (
                  <button
                    key={flower.id}
                    onClick={() => addFlower(flower)}
                    className="w-full flex items-center gap-4 p-4 rounded-lg border-2 border-border/40 hover:border-primary transition-all hover:scale-105 bg-white"
                  >
                    <span className="text-4xl">{flower.emoji}</span>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-foreground">{flower.name}</div>
                      <div className="text-sm text-muted-foreground">{flower.price} ₽</div>
                    </div>
                    <Icon name="Plus" size={20} className="text-primary" />
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
                <p className="text-muted-foreground">Выберите цветы из каталога слева</p>
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
                    {selectedFlowers.map(({ flower, count }) => (
                      <div key={flower.id} className="flex items-center gap-4 p-4 bg-secondary/20 rounded-lg">
                        <span className="text-3xl">{flower.emoji}</span>
                        <div className="flex-1">
                          <div className="font-semibold">{flower.name}</div>
                          <div className="text-sm text-muted-foreground">{flower.price} ₽ × {count} = {flower.price * count} ₽</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => updateCount(flower.id, -1)}
                            variant="outline"
                            size="sm"
                          >
                            <Icon name="Minus" size={16} />
                          </Button>
                          <span className="w-8 text-center font-semibold">{count}</span>
                          <Button
                            onClick={() => updateCount(flower.id, 1)}
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
                                  className="absolute text-3xl"
                                  style={{
                                    left: `${item.position.x}%`,
                                    top: `${item.position.y}%`,
                                    transform: `translate(-50%, -50%) rotate(${item.position.rotation}deg)`,
                                  }}
                                >
                                  {item.flower.emoji}
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
                                {selectedFlowers.map(({ flower, count }) => (
                                  <div key={flower.id} className="flex items-center gap-2 mb-1">
                                    <span>{flower.emoji}</span>
                                    <span className="text-sm">{flower.name} × {count}</span>
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
                                className="absolute text-5xl transition-all duration-300"
                                style={{
                                  left: `${item.position.x}%`,
                                  top: `${item.position.y}%`,
                                  transform: `translate(-50%, -50%) rotate(${item.position.rotation}deg)`,
                                }}
                              >
                                {item.flower.emoji}
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
    </div>
  );
};

export default Index;
