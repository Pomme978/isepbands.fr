'use client';

import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import Image from 'next/image';
import guitarSvg from '@/assets/svg/guitar_joinus.svg';

export default function GuitarWithCable() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const guitarBodyRef = useRef<Matter.Body | null>(null);
  const cableBodiesRef = useRef<Matter.Body[]>([]);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [guitarPos, setGuitarPos] = useState({ x: 400, y: 300, angle: 0 });
  const [cablePoints, setCablePoints] = useState<{ x: number; y: number }[]>([]);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // ========== PARAMÈTRES SIMPLES POUR L'ATTACHEMENT CÂBLE ==========
  // IMPORTANT : Ces valeurs déterminent où le câble se branche sur la guitare

  // 1. POSITION DU JACK SUR LA GUITARE (relatif au centre de la guitare)
  // IMPORTANT: La guitare SVG non-rotée a le corps en bas, le manche en haut
  // Le jack est en bas à droite du corps de la guitare
  const JACK_X = 0; // Distance du centre vers la DROITE (+) pour bas-droite du corps
  const JACK_Y = 80; // Distance du centre vers le BAS (+) pour bas du corps

  // 2. FORCE DE L'ATTACHEMENT
  const ATTACHMENT_RIGIDITY = 1.0; // 0.1=souple, 1.0=rigide (RECOMMANDÉ: 1.0)
  const ATTACHMENT_DAMPING = 0.1; // 0.0=rebondit, 1.0=amorti (RECOMMANDÉ: 0.1)

  // 3. LONGUEUR MAXIMUM DU CÂBLE
  const CABLE_LENGTH_MAX = 300; // Court pour rester dans la page visible

  // 4. POSITION DU POINT DE DÉPART DU CÂBLE (ampli)
  const CABLE_START_X = 250; // Position X du point fixe ampli
  const CABLE_START_Y = 200; // Position Y du point fixe ampli

  // 4. FORME RÉELLE DE LA GUITARE (SVG PATH de guitar_svgbody.svg)
  const GUITAR_BODY_PATH = "M1328.06 2374.97L1410.36 2379.93C1653.04 2402.35 1702.35 2269.18 1697.76 2184.78C1689.97 2041.62 1607.65 1993.62 1605.9 1898.81C1604.84 1841.06 1662.58 1792.51 1658.34 1695.66C1656.84 1661.46 1622.88 1626.37 1602.28 1639.64C1601.85 1639.92 1601.39 1640.19 1600.93 1640.44C1580.17 1651.82 1580.04 1699.27 1561.9 1731.21C1556.14 1741.34 1529.27 1776.87 1499.93 1772.09C1460.15 1765.61 1466.64 1682.66 1452.7 1661.88L1452.59 1661.72C1450.92 1659.22 1449.16 1656.6 1448.82 1653.62C1445.87 1628.29 1443.05 1602.57 1438.71 1585.12C1438.52 1584.33 1438.41 1583.53 1438.39 1582.72L1426.87 922.848C1425.65 828.808 1425.51 804.747 1466.92 760.229C1481.67 744.383 1496.51 731.451 1482.73 693.29C1468.95 655.131 1467.47 614.341 1475.35 549.876C1477.98 528.388 1485.84 517.408 1472.2 503.311C1452.63 486.511 1427.73 499.558 1413.43 531.678C1399.35 563.293 1349.76 741.634 1336.31 785.976C1334.74 791.134 1337.17 796.825 1342.06 799.111L1351.5 803.53C1355.28 805.296 1357.62 809.164 1357.43 813.329L1349.14 999.313L1336.77 1652.2C1336.73 1654.3 1336 1656.32 1335.17 1658.24C1330.81 1668.3 1330.27 1687.96 1307.56 1676.16C1228.56 1635.15 1278.34 1506.8 1211.12 1510.42C1129.59 1514.8 1156.26 1684.44 1180.49 1752.2C1213.1 1843.36 1204.57 1895.23 1161.85 1982.61C1122.14 2063.81 1085.27 2183.78 1134.32 2269.5C1167.6 2327.66 1222.95 2376.86 1328.06 2374.97Z";

  // 5. SCALING FACTOR pour ajuster la taille SVG à nos dimensions de guitare
  const GUITAR_SVG_SCALE = 0.8; // Plus gros pour plus de stabilité

  // 6. PARAMÈTRES CÂBLE ET JACK
  const CABLE_SEGMENT_RADIUS = 18; // Câble plus épais
  const JACK_CONNECTOR_SIZE = 60; // Taille de l'embout jack solide

  // PARAMÈTRES GUITARE - Dimensions cohérentes entre physique et affichage
  const GUITAR_WIDTH = 1000; // Plus grande
  const GUITAR_HEIGHT = 1500; // Plus grande
  const GUITAR_DENSITY = 0.8; // Plus lourde que le câble pour tomber correctement
  const GUITAR_FRICTION_AIR = 0.02; // Plus de friction pour stabiliser les rotations
  const GUITAR_ROTATION_OFFSET = Math.PI / 4; // 45° pour orienter manche vers bas-droite

  // Positions initiales (calculées dans useEffect car dépendent des dimensions)
  const GUITAR_INITIAL_X = CABLE_START_X + 200; // Position X TRÈS proche de l'ampli
  const GUITAR_INITIAL_Y = CABLE_START_Y + 250; // Position Y juste sous l'ampli

  // Fonction pour convertir un path SVG en vertices pour Matter.js
  const parseSvgPathToVertices = (pathString: string, scale: number = 1): { x: number; y: number }[] => {
    const vertices: { x: number; y: number }[] = [];
    
    // Simplification basique : extraire les coordonnées M et L
    const matches = pathString.match(/[ML]\s*([0-9.-]+)\s+([0-9.-]+)|C\s*([0-9.-]+)\s+([0-9.-]+)\s+([0-9.-]+)\s+([0-9.-]+)\s+([0-9.-]+)\s+([0-9.-]+)/g);
    
    if (!matches) return [];
    
    for (const match of matches) {
      if (match.startsWith('M') || match.startsWith('L')) {
        const coords = match.substring(1).trim().split(/\s+/);
        if (coords.length >= 2) {
          vertices.push({
            x: parseFloat(coords[0]) * scale,
            y: parseFloat(coords[1]) * scale
          });
        }
      } else if (match.startsWith('C')) {
        // Pour les courbes, prendre seulement le point final
        const coords = match.substring(1).trim().split(/\s+/);
        if (coords.length >= 6) {
          vertices.push({
            x: parseFloat(coords[4]) * scale,
            y: parseFloat(coords[5]) * scale
          });
        }
      }
    }
    
    // SIMPLIFICATION CRUCIALE : Réduire le nombre de vertices pour stabilité
    const simplifiedVertices = [];
    const step = Math.max(1, Math.floor(vertices.length / 12)); // Max 12 points
    for (let i = 0; i < vertices.length; i += step) {
      simplifiedVertices.push(vertices[i]);
    }
    
    // Centrer les vertices autour de l'origine
    if (simplifiedVertices.length > 0) {
      const minX = Math.min(...simplifiedVertices.map(v => v.x));
      const maxX = Math.max(...simplifiedVertices.map(v => v.x));
      const minY = Math.min(...simplifiedVertices.map(v => v.y));
      const maxY = Math.max(...simplifiedVertices.map(v => v.y));
      
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      
      return simplifiedVertices.map(v => ({
        x: v.x - centerX,
        y: v.y - centerY
      }));
    }
    
    return simplifiedVertices;
  };

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;

    const width = window.innerWidth;
    const height = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      window.innerHeight * 2,
    );

    setDimensions({ width, height });

    canvas.width = width;
    canvas.height = height;

    // Pas de modification de style overflow sur le container

    const engine = Matter.Engine.create();
    engineRef.current = engine;
    engine.world.gravity.y = 1.0; // Gravité terrestre normale
    engine.timing.timeScale = 1;
    
    // IMPORTANT : Augmenter les itérations pour stabilité des contraintes rigides
    engine.constraintIterations = 10; // MAXIMUM pour empêcher l'étirement

    const render = Matter.Render.create({
      canvas: canvas,
      engine: engine,
      options: {
        width: width,
        height: height,
        wireframes: false,
        background: 'transparent',
        showDebug: false,
        showVelocity: false,
        showAngleIndicator: false,
        showBounds: false,
        hasBounds: false,
        enabled: true,
      },
    });
    renderRef.current = render;

    // Point fixe ampli avec position configurable
    const ampAnchor = Matter.Bodies.rectangle(CABLE_START_X, CABLE_START_Y, 20, 20, {
      isStatic: true,
      render: { visible: false },
    });

    // ========== GUITARE SIMPLE ET STABLE ==========
    // Forme rectangulaire simple qui fonctionne
    const guitar = Matter.Bodies.rectangle(
      GUITAR_INITIAL_X,
      GUITAR_INITIAL_Y,
      GUITAR_WIDTH * 0.4, // Plus compact
      GUITAR_HEIGHT * 0.7, // Plus compact
      {
        density: GUITAR_DENSITY,
        frictionAir: GUITAR_FRICTION_AIR,
        render: { visible: false },
      }
    );
    guitarBodyRef.current = guitar;

    // ========== CÂBLE SIMPLE ET STABLE ==========
    const segments = 8; // Moins de segments pour câble court
    const cableBodies: Matter.Body[] = [];
    const segmentLength = 25; // Segments courts pour longueur totale réduite
    
    // Créer les segments du câble
    for (let i = 0; i < segments; i++) {
      const x = CABLE_START_X + (i * segmentLength * 0.7);
      const y = CABLE_START_Y + (i * 10);
      
      const segment = Matter.Bodies.circle(x, y, 5, {
        density: 0.01, // Léger pour ne pas interférer avec la guitare
        frictionAir: 0.02,
        render: { visible: false },
      });
      
      cableBodies.push(segment);
    }
    cableBodiesRef.current = cableBodies;

    // Contraintes MANUELLES simples
    const constraints: Matter.Constraint[] = [];
    
    // 1. Ampli → premier segment
    constraints.push(Matter.Constraint.create({
      bodyA: ampAnchor,
      bodyB: cableBodies[0],
      length: 0,
      stiffness: 0.9,
      render: { visible: false }
    }));
    
    // 2. Contraintes SIMPLES mais RIGIDES
    for (let i = 0; i < segments - 1; i++) {
      constraints.push(Matter.Constraint.create({
        bodyA: cableBodies[i],
        bodyB: cableBodies[i + 1],
        length: segmentLength, // Distance exacte
        stiffness: 0.99, // Quasi maximum
        damping: 0.05, // Très peu d'amortissement
        render: { visible: false }
      }));
    }
    
    // 3. Dernier segment → guitare (RIGIDE)
    constraints.push(Matter.Constraint.create({
      bodyA: cableBodies[segments - 1],
      bodyB: guitar,
      pointB: { x: JACK_X, y: JACK_Y },
      length: 20,
      stiffness: 1.0, // MAXIMUM pour empêcher l'étirement
      damping: 0.1,
      render: { visible: false }
    }));
    
    // PAS de contrainte anti-rotation - ça tire la guitare !

    // Contrôle souris avec gestion scroll
    const mouse = Matter.Mouse.create(canvas);

    // Supprimer les event listeners de scroll de Matter.js pour permettre le scroll de page
    mouse.element.removeEventListener('mousewheel', mouse.mousewheel);
    mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);
    mouse.element.removeEventListener('wheel', mouse.mousewheel);

    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });

    // Gestion du drag sans interférer avec le scroll de page
    let scrollTimeout: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      // Désactiver temporairement les interactions canvas pendant le scroll
      canvas.style.pointerEvents = 'none';

      // Réactiver après un délai
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        canvas.style.pointerEvents = 'auto';
      }, 150);
    };

    // Écouter les événements de scroll sur la fenêtre
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Bordures (très éloignées pour permettre à la guitare de sortir de l'écran)
    const walls = [
      Matter.Bodies.rectangle(width / 2, -2000, width, 100, {
        isStatic: true,
        render: { visible: false },
      }),
      Matter.Bodies.rectangle(width / 2, height + 2000, width, 100, {
        isStatic: true,
        render: { visible: false },
      }),
      Matter.Bodies.rectangle(-2000, height / 2, 100, height, {
        isStatic: true,
        render: { visible: false },
      }),
      Matter.Bodies.rectangle(width + 2000, height / 2, 100, height, {
        isStatic: true,
        render: { visible: false },
      }),
    ];

    // Ajouter tout au monde
    Matter.World.add(engine.world, [
      ampAnchor,
      guitar, // La guitare
      ...cableBodies, // Tous les segments du câble flexible
      ...constraints, // Toutes les contraintes
      ...walls,
      mouseConstraint,
    ]);

    // Boucle d'animation
    const updatePositions = () => {
      if (guitarBodyRef.current) {
        setGuitarPos({
          x: guitarBodyRef.current.position.x,
          y: guitarBodyRef.current.position.y,
          angle: guitarBodyRef.current.angle,
        });
      }

      // Générer le path du câble flexible en suivant les segments
      if (cableBodiesRef.current && cableBodiesRef.current.length > 0) {
        const points = [];
        
        // Point de départ : ampli
        points.push({ x: CABLE_START_X, y: CABLE_START_Y });
        
        // Points des segments du câble
        cableBodiesRef.current.forEach((body) => {
          points.push({ x: body.position.x, y: body.position.y });
        });
        
        setCablePoints(points);
      }

      animationFrameRef.current = requestAnimationFrame(updatePositions);
    };

    const runner = Matter.Runner.create();
    runnerRef.current = runner;

    Matter.Render.run(render);
    Matter.Runner.run(runner, engine);
    updatePositions();

    return () => {
      // Nettoyer les écouteurs d'événements
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (renderRef.current) {
        Matter.Render.stop(renderRef.current);
      }
      if (runnerRef.current && engineRef.current) {
        Matter.Runner.stop(runnerRef.current);
      }
      if (engineRef.current) {
        Matter.Engine.clear(engineRef.current);
      }
    };
  }, []);

  const generateCablePath = (): string => {
    if (cablePoints.length < 2) return '';

    let path = `M ${cablePoints[0].x} ${cablePoints[0].y}`;

    for (let i = 1; i < cablePoints.length; i++) {
      path += ` L ${cablePoints[i].x} ${cablePoints[i].y}`;
    }

    return path;
  };

  return (
    <div
      ref={containerRef}
      className="absolute top-0 left-0 pointer-events-none w-full z-50"
      style={{
        height: `${dimensions.height}px`,
        width: '100%',
        pointerEvents: 'none',
        overflowX: 'hidden', // CACHE l'overflow horizontal
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute opacity-0 overflow-x-none w-full"
        style={{
          pointerEvents: 'auto',
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          top: 0,
          left: 0,
          position: 'absolute',
        }}
      />

      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      >
        <path
          d={generateCablePath()}
          stroke="#2a2a2a"
          strokeWidth="26"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div
        className="absolute z-20 pointer-events-none"
        style={{
          left: `${guitarPos.x - GUITAR_WIDTH / 2}px`,
          top: `${guitarPos.y - GUITAR_HEIGHT / 2}px`,
          transform: `rotate(${guitarPos.angle + GUITAR_ROTATION_OFFSET}rad)`,
          transformOrigin: '50% 50%',
          width: `${GUITAR_WIDTH}px`,
          height: `${GUITAR_HEIGHT}px`,
        }}
      >
        <Image
          src={guitarSvg}
          alt="Guitar"
          width={GUITAR_WIDTH}
          height={GUITAR_HEIGHT}
          className="drop-shadow-lg"
          priority
        />
      </div>
    </div>
  );
}
