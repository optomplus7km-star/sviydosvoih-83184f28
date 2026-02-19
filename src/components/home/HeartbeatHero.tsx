import { useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  phase: number;
}

interface Particle {
  x: number;
  y: number;
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
  alpha: number;
}

export function HeartbeatHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const { t } = useTranslation();

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    // Nodes (floating people icons)
    const nodeCount = 14;
    const nodesRef = useRef<Node[]>([]);
    if (nodesRef.current.length === 0) {
      for (let i = 0; i < nodeCount; i++) {
        nodesRef.current.push({
          x: Math.random() * W,
          y: H * 0.45 + Math.random() * H * 0.45,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.2,
          radius: 6 + Math.random() * 8,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    // Particles along connections
    const particlesRef = useRef<Particle[]>([]);

    return { ctx, W, H, nodesRef, particlesRef, dpr };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    let W = canvas.clientWidth;
    let H = canvas.clientHeight;

    // Create nodes
    const nodeCount = 14;
    const nodes: Node[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: 0.1 * W + Math.random() * 0.8 * W,
        y: H * 0.5 + Math.random() * H * 0.35,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.15,
        radius: 5 + Math.random() * 7,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Particles
    const particles: Particle[] = [];
    const maxDist = 200;

    const spawnParticle = () => {
      if (particles.length > 30) return;
      const a = Math.floor(Math.random() * nodeCount);
      let b = Math.floor(Math.random() * nodeCount);
      if (a === b) b = (a + 1) % nodeCount;
      const dx = nodes[a].x - nodes[b].x;
      const dy = nodes[a].y - nodes[b].y;
      if (Math.sqrt(dx * dx + dy * dy) < maxDist) {
        particles.push({
          x: 0, y: 0,
          fromNode: a, toNode: b,
          progress: 0,
          speed: 0.003 + Math.random() * 0.005,
          alpha: 0.4 + Math.random() * 0.5,
        });
      }
    };

    let time = 0;

    const animate = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);

      time += 0.015;

      // Clear with gradient background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, '#0F0F15');
      bgGrad.addColorStop(1, '#1A1425');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // === HEARTBEAT SINE WAVE ===
      const waveY = H * 0.32;
      const amplitude = 30;
      const frequency = 0.008;

      // Glow layer
      for (let g = 0; g < 3; g++) {
        ctx.beginPath();
        const blur = 8 + g * 12;
        ctx.shadowColor = g < 1 ? '#FF4D6D' : '#A78BFA';
        ctx.shadowBlur = blur;
        ctx.lineWidth = 3 - g * 0.8;

        const grad = ctx.createLinearGradient(0, 0, W, 0);
        grad.addColorStop(0, `rgba(255, 77, 109, ${0.8 - g * 0.2})`);
        grad.addColorStop(0.5, `rgba(190, 120, 220, ${0.7 - g * 0.15})`);
        grad.addColorStop(1, `rgba(167, 139, 250, ${0.8 - g * 0.2})`);
        ctx.strokeStyle = grad;

        for (let x = 0; x <= W; x += 2) {
          // Heartbeat-like sine with modulation
          const t1 = x * frequency + time * 2;
          const pulse = Math.sin(t1) * Math.pow(Math.abs(Math.sin(t1 * 0.5)), 0.3);
          const y = waveY + pulse * amplitude * (0.7 + 0.3 * Math.sin(time * 0.5));

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      // === NETWORK CONNECTIONS ===
      // Move nodes
      for (const node of nodes) {
        node.x += node.vx + Math.sin(time + node.phase) * 0.15;
        node.y += node.vy + Math.cos(time * 0.7 + node.phase) * 0.1;

        if (node.x < 30 || node.x > W - 30) node.vx *= -1;
        if (node.y < H * 0.45 || node.y > H - 30) node.vy *= -1;
        node.x = Math.max(20, Math.min(W - 20, node.x));
        node.y = Math.max(H * 0.42, Math.min(H - 20, node.y));
      }

      // Draw connections
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.25;
            // Curved line
            ctx.beginPath();
            const midX = (nodes[i].x + nodes[j].x) / 2;
            const midY = (nodes[i].y + nodes[j].y) / 2 - 20 * Math.sin(time + i);
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.quadraticCurveTo(midX, midY, nodes[j].x, nodes[j].y);

            const lineGrad = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
            lineGrad.addColorStop(0, `rgba(255, 77, 109, ${alpha})`);
            lineGrad.addColorStop(1, `rgba(167, 139, 250, ${alpha})`);
            ctx.strokeStyle = lineGrad;
            ctx.lineWidth = 1;
            ctx.shadowColor = '#FF4D6D';
            ctx.shadowBlur = 4;
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        }
      }

      // Draw nodes (avatar circles)
      for (const node of nodes) {
        const glow = 0.5 + 0.3 * Math.sin(time * 2 + node.phase);
        // Outer glow
        const radGrad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 3);
        radGrad.addColorStop(0, `rgba(255, 77, 109, ${glow * 0.3})`);
        radGrad.addColorStop(1, 'rgba(255, 77, 109, 0)');
        ctx.fillStyle = radGrad;
        ctx.fillRect(node.x - node.radius * 3, node.y - node.radius * 3, node.radius * 6, node.radius * 6);

        // Circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        const cGrad = ctx.createRadialGradient(node.x - 2, node.y - 2, 0, node.x, node.y, node.radius);
        cGrad.addColorStop(0, `rgba(255, 110, 140, ${0.7 + glow * 0.3})`);
        cGrad.addColorStop(1, `rgba(167, 139, 250, ${0.5 + glow * 0.3})`);
        ctx.fillStyle = cGrad;
        ctx.fill();

        // Person icon (simple head + shoulders)
        ctx.fillStyle = `rgba(15, 15, 21, ${0.6 + glow * 0.2})`;
        const s = node.radius * 0.35;
        ctx.beginPath();
        ctx.arc(node.x, node.y - s * 0.5, s, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(node.x, node.y + s * 1.2, s * 1.3, Math.PI, 0);
        ctx.fill();
      }

      // === PARTICLES ===
      if (Math.random() < 0.15) spawnParticle();

      for (let p = particles.length - 1; p >= 0; p--) {
        const part = particles[p];
        part.progress += part.speed;
        if (part.progress >= 1) {
          particles.splice(p, 1);
          continue;
        }

        const from = nodes[part.fromNode];
        const to = nodes[part.toNode];
        const t2 = part.progress;
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2 - 20;
        // Quadratic bezier interpolation
        const px = (1 - t2) * (1 - t2) * from.x + 2 * (1 - t2) * t2 * midX + t2 * t2 * to.x;
        const py = (1 - t2) * (1 - t2) * from.y + 2 * (1 - t2) * t2 * midY + t2 * t2 * to.y;

        const pAlpha = part.alpha * Math.sin(t2 * Math.PI);
        const pGrad = ctx.createRadialGradient(px, py, 0, px, py, 4);
        pGrad.addColorStop(0, `rgba(255, 180, 200, ${pAlpha})`);
        pGrad.addColorStop(1, `rgba(167, 139, 250, 0)`);
        ctx.fillStyle = pGrad;
        ctx.fillRect(px - 4, py - 4, 8, 8);

        ctx.beginPath();
        ctx.arc(px, py, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${pAlpha * 0.8})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: 'block' }}
      />

      {/* Content overlay */}
      <div className="kraken-container relative z-10 py-20">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-6 animate-fade-in">
            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium tracking-[0.25em] uppercase text-primary/80">
              Мережа · Єдність · Дія
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-up leading-[1.1]">
            <span className="kraken-gradient-text">Мережіво</span>
            <br />
            <span className="text-foreground/90">
              {t('hero', 'title')}
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            {t('hero', 'subtitle')}
          </p>

          <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Button size="lg" className="kraken-btn-glow gap-2 text-base px-8" asChild>
              <Link to="/catalog">
                <Compass className="h-5 w-5" />
                {t('hero', 'cta')}
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2 text-base border-primary/30 hover:bg-primary/10 hover:text-primary" asChild>
              <Link to="/signup">
                {t('hero', 'ctaSecondary')}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
