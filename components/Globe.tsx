"use client";
import { useEffect, useRef } from "react";

const EXPORTS = [
  {lat:25.2,lng:55.3},{lat:24.7,lng:46.7},{lat:25.3,lng:51.5},
  {lat:29.4,lng:47.9},{lat:23.6,lng:58.6},{lat:26.0,lng:50.5},
  {lat:51.5,lng:-0.1},{lat:52.4,lng:4.9},{lat:52.5,lng:13.4},
  {lat:48.9,lng:2.3},{lat:40.4,lng:-3.7},{lat:38.9,lng:-77.0},
  {lat:45.4,lng:-75.7},{lat:-15.8,lng:-47.9},{lat:1.3,lng:103.8},
  {lat:3.1,lng:101.7},{lat:35.7,lng:139.7},{lat:-25.3,lng:133.8},
  {lat:6.5,lng:3.4},{lat:-1.3,lng:36.8},{lat:-30.6,lng:22.9},
  {lat:9.0,lng:38.7},{lat:30.1,lng:31.2},{lat:23.8,lng:90.4},
  {lat:7.9,lng:80.7},
];

// Detailed land polygons [lat,lng]
const LAND: number[][][] = [
  // North America
  [[70,-140],[72,-120],[70,-95],[60,-65],[50,-55],[45,-63],[40,-65],[35,-75],
   [25,-80],[20,-87],[15,-88],[10,-85],[8,-77],[10,-75],[20,-105],[22,-110],
   [30,-115],[38,-122],[48,-124],[55,-130],[60,-140],[70,-140]],
  // Greenland
  [[60,-45],[65,-38],[70,-22],[76,-18],[83,-30],[83,-50],[75,-68],[65,-55],[60,-45]],
  // South America
  [[10,-75],[12,-72],[8,-63],[5,-52],[2,-50],[-5,-35],[-10,-37],[-20,-40],
   [-30,-50],[-38,-57],[-55,-65],[-55,-70],[-45,-75],[-35,-72],[-20,-70],
   [-5,-80],[2,-77],[5,-77],[10,-75]],
  // Europe
  [[71,28],[70,18],[65,14],[58,5],[51,2],[48,-5],[44,-8],[36,-6],[36,10],
   [40,18],[38,28],[41,28],[45,13],[48,17],[54,18],[58,22],[65,25],[71,28]],
  // Scandinavia
  [[71,28],[70,31],[69,28],[65,14],[58,5],[57,8],[58,11],[62,6],[65,14],[70,18],[71,28]],
  // Africa
  [[37,10],[37,30],[22,38],[10,42],[0,42],[-10,40],[-25,33],[-35,20],
   [-35,18],[-22,17],[-18,12],[-15,-17],[-5,-10],[5,-5],[10,-15],[15,-17],
   [22,-16],[30,-10],[37,10]],
  // Main Asia
  [[70,30],[72,60],[72,100],[70,140],[60,150],[50,140],[40,130],[35,127],
   [22,114],[20,110],[5,100],[2,103],[-5,105],[0,110],[10,123],[20,120],
   [25,122],[30,122],[35,125],[40,130],[50,142],[55,135],[60,150],[70,140],
   [72,100],[70,60],[65,30],[60,30],[55,22],[50,30],[45,40],[40,45],[35,50],
   [30,48],[25,57],[22,60],[25,68],[28,72],[20,73],[15,74],[10,77],[8,77],
   [5,80],[8,80],[10,79],[20,86],[25,88],[22,92],[26,93],[28,97],[27,97],
   [30,100],[35,80],[35,75],[30,73],[25,68],[22,60],[25,57],[30,48],[35,50],
   [40,45],[45,40],[50,30],[55,22],[60,30],[65,30],[70,30]],
  // Indian subcontinent (separate for highlight)
  [[28,72],[22,68],[8,77],[5,80],[8,80],[10,79],[20,86],[25,88],[28,97],
   [27,97],[24,92],[26,90],[23,88],[20,86],[10,79],[8,77],[10,77],[15,74],
   [20,73],[28,72]],
  // Australia
  [[-15,130],[-12,136],[-12,142],[-18,147],[-28,154],[-38,147],[-38,140],
   [-32,133],[-32,115],[-22,114],[-15,128],[-15,130]],
  // Japan
  [[30,130],[34,129],[34,131],[36,136],[35,137],[33,131],[30,130]],
  [[40,140],[42,140],[44,145],[43,141],[40,140]],
];

function project(lat: number, lng: number, R: number, rot: number) {
  const phi = (90 - lat) * Math.PI / 180;
  const theta = (lng + 180) * Math.PI / 180;
  const x = -R * Math.sin(phi) * Math.cos(theta);
  const y = R * Math.cos(phi);
  const z = R * Math.sin(phi) * Math.sin(theta);
  const c = Math.cos(rot), s = Math.sin(rot);
  const rx = x*c - z*s;
  const rz = x*s + z*c;
  return { x: rx, y, z: rz, vis: rz > -R * 0.1 };
}

export default function GlobeComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frame = useRef<number>(0);
  const rot = useRef(1.8);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const size = canvas.offsetWidth;
    canvas.width = size * window.devicePixelRatio;
    canvas.height = size * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    const cx = size/2, cy = size/2, R = size * 0.44;

    function draw() {
      ctx.clearRect(0, 0, size, size);

      // Glow
      const glow = ctx.createRadialGradient(cx,cy,R*0.5,cx,cy,R*1.5);
      glow.addColorStop(0,"rgba(196,147,10,0.06)");
      glow.addColorStop(1,"rgba(0,0,0,0)");
      ctx.fillStyle=glow; ctx.fillRect(0,0,size,size);

      // Ocean
      ctx.save();
      ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2); ctx.clip();
      const ocean = ctx.createRadialGradient(cx-R*0.2,cy-R*0.2,0,cx,cy,R);
      ocean.addColorStop(0,"#1a3d6e");
      ocean.addColorStop(0.6,"#0e2548");
      ocean.addColorStop(1,"#071428");
      ctx.fillStyle=ocean; ctx.fillRect(0,0,size,size);

      // Grid lines
      ctx.strokeStyle="rgba(100,160,255,0.06)"; ctx.lineWidth=0.5;
      for(let lat=-60;lat<=60;lat+=30){
        ctx.beginPath(); let f=true;
        for(let lg=-180;lg<=180;lg+=3){
          const p=project(lat,lg,R,rot.current);
          if(p.vis){f?ctx.moveTo(cx+p.x,cy-p.y):ctx.lineTo(cx+p.x,cy-p.y);f=false;}else f=true;
        } ctx.stroke();
      }
      for(let lg=-180;lg<180;lg+=30){
        ctx.beginPath(); let f=true;
        for(let lat=-85;lat<=85;lat+=3){
          const p=project(lat,lg,R,rot.current);
          if(p.vis){f?ctx.moveTo(cx+p.x,cy-p.y):ctx.lineTo(cx+p.x,cy-p.y);f=false;}else f=true;
        } ctx.stroke();
      }

      // Land masses
      LAND.forEach((poly, polyIdx) => {
        const isIndia = polyIdx === 7;
        ctx.beginPath();
        let first = true;
        let hasVisible = false;
        poly.forEach(([lat,lng]) => {
          const p = project(lat,lng,R,rot.current);
          if(p.vis){
            first?ctx.moveTo(cx+p.x,cy-p.y):ctx.lineTo(cx+p.x,cy-p.y);
            first=false; hasVisible=true;
          }
        });
        if(!hasVisible) return;
        ctx.closePath();
        if(isIndia){
          ctx.fillStyle="rgba(196,147,10,0.45)";
          ctx.strokeStyle="#C4930A"; ctx.lineWidth=1.2;
        } else {
          ctx.fillStyle="rgba(45,90,45,0.55)";
          ctx.strokeStyle="rgba(80,140,80,0.4)"; ctx.lineWidth=0.5;
        }
        ctx.fill(); ctx.stroke();
      });

      // Atmosphere
      const atm = ctx.createRadialGradient(cx,cy,R*0.82,cx,cy,R);
      atm.addColorStop(0,"rgba(80,140,255,0)");
      atm.addColorStop(1,"rgba(80,140,255,0.18)");
      ctx.fillStyle=atm; ctx.fillRect(0,0,size,size);

      // Shine
      const sh = ctx.createRadialGradient(cx-R*0.38,cy-R*0.38,0,cx,cy,R);
      sh.addColorStop(0,"rgba(255,255,255,0.1)");
      sh.addColorStop(0.45,"rgba(255,255,255,0)");
      ctx.fillStyle=sh; ctx.fillRect(0,0,size,size);
      ctx.restore();

      // Globe border
      ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2);
      ctx.strokeStyle="rgba(196,147,10,0.25)"; ctx.lineWidth=1.5; ctx.stroke();

      // Export dots
      const t = Date.now();
      EXPORTS.forEach((pt,i) => {
        const p = project(pt.lat,pt.lng,R,rot.current);
        if(!p.vis) return;
        const sx=cx+p.x, sy=cy-p.y;
        const pulse=(Math.sin(t/600+i*0.7)+1)/2;
        ctx.beginPath(); ctx.arc(sx,sy,6+pulse*6,0,Math.PI*2);
        ctx.fillStyle=`rgba(196,147,10,${0.12+pulse*0.12})`; ctx.fill();
        ctx.beginPath(); ctx.arc(sx,sy,2.8,0,Math.PI*2);
        ctx.fillStyle="#E8A020"; ctx.fill();
      });

      // India big dot
      const ip = project(20.6,78.9,R,rot.current);
      if(ip.vis){
        const sx=cx+ip.x, sy=cy-ip.y;
        const pulse=(Math.sin(t/400)+1)/2;
        ctx.beginPath(); ctx.arc(sx,sy,12+pulse*10,0,Math.PI*2);
        ctx.fillStyle=`rgba(245,200,66,${0.2+pulse*0.2})`; ctx.fill();
        ctx.beginPath(); ctx.arc(sx,sy,5,0,Math.PI*2);
        ctx.fillStyle="#F5C842"; ctx.fill();
      }

      rot.current -= 0.003;
      frame.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(frame.current);
  },[]);

  return <canvas ref={canvasRef} style={{width:"100%",height:"100%",borderRadius:"50%"}} />;
}
