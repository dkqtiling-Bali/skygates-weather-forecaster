import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.min.js';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
let ctx=null, latest=null;
function moonPhase(date=new Date()){const syn=29.530588853,known=Date.UTC(2000,0,6,18,14),days=(date-known)/86400000;return ((days/syn)%1+1)%1}
function build(world){
 if(ctx||!world)return; const canvas=world.querySelector('.v026-three-canvas'); if(!canvas)return;
 const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.65));renderer.setClearColor(0x000000,0);
 const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(55,1,.1,100);camera.position.set(0,0,9);
 const ambient=new THREE.AmbientLight(0x9fc5ff,.55);scene.add(ambient);
 const sunLight=new THREE.DirectionalLight(0xffdf9a,1.7);sunLight.position.set(-4,4,5);scene.add(sunLight);
 const sun=new THREE.Mesh(new THREE.SphereGeometry(.34,24,16),new THREE.MeshBasicMaterial({color:0xffe29a,transparent:true,opacity:.95}));scene.add(sun);
 const sunHalo=new THREE.Mesh(new THREE.SphereGeometry(.75,20,12),new THREE.MeshBasicMaterial({color:0xffb347,transparent:true,opacity:.16,blending:THREE.AdditiveBlending,depthWrite:false}));scene.add(sunHalo);
 const moon=new THREE.Mesh(new THREE.SphereGeometry(.38,28,18),new THREE.MeshStandardMaterial({color:0xe7edf3,roughness:.92,metalness:0}));scene.add(moon);
 const moonLight=new THREE.PointLight(0xb9d8ff,.75,20);scene.add(moonLight);
 const cloudGroup=new THREE.Group();scene.add(cloudGroup);
 for(let i=0;i<26;i++){const g=new THREE.SphereGeometry(.38+Math.random()*.62,10,7),m=new THREE.MeshLambertMaterial({color:0xd6e0e8,transparent:true,opacity:.12,depthWrite:false});const q=new THREE.Mesh(g,m);q.scale.set(1.8+Math.random()*2,.45+Math.random()*.45,.5);q.position.set(-8+Math.random()*16,1+Math.random()*4,-1-Math.random()*4);q.userData.speed=.0015+Math.random()*.004;cloudGroup.add(q)}
 const rainCount=900, rainPos=new Float32Array(rainCount*3);for(let i=0;i<rainCount;i++){rainPos[i*3]=-7+Math.random()*14;rainPos[i*3+1]=-5+Math.random()*12;rainPos[i*3+2]=-3+Math.random()*6}const rainGeo=new THREE.BufferGeometry();rainGeo.setAttribute('position',new THREE.BufferAttribute(rainPos,3));const rain=new THREE.Points(rainGeo,new THREE.PointsMaterial({color:0xaad9ff,size:.035,transparent:true,opacity:.6,depthWrite:false}));scene.add(rain);
 const starCount=500, starPos=new Float32Array(starCount*3);for(let i=0;i<starCount;i++){starPos[i*3]=-9+Math.random()*18;starPos[i*3+1]=-1+Math.random()*10;starPos[i*3+2]=-6+Math.random()*4}const starGeo=new THREE.BufferGeometry();starGeo.setAttribute('position',new THREE.BufferAttribute(starPos,3));const stars=new THREE.Points(starGeo,new THREE.PointsMaterial({color:0xe9f3ff,size:.035,transparent:true,opacity:.85,depthWrite:false}));scene.add(stars);
 const flash=new THREE.PointLight(0xd8efff,0,40);flash.position.set(0,3,5);scene.add(flash);let nextFlash=0,flashEnd=0;
 function resize(){const r=world.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);camera.aspect=Math.max(1,r.width)/Math.max(1,r.height);camera.updateProjectionMatrix()}addEventListener('resize',resize);resize();
 function apply(data){latest=data;const c=data?.current||{},code=+c.weather_code||0,day=c.is_day!==0,cloud=clamp(+c.cloud_cover||0,0,100);sun.visible=day&&code<80;sunHalo.visible=sun.visible;moon.visible=!day;moonLight.visible=!day;stars.visible=!day;rain.visible=code>=51;cloudGroup.visible=cloud>5||code>=45;cloudGroup.children.forEach((q,i)=>q.material.opacity=.035+cloud/100*.20+(code>=80?.08:0));ambient.intensity=day?(code>=95?.24:code>=51?.38:.62):.16;sunLight.intensity=day?(code<=1?2.2:code<51?1.15:.3):0;renderer.toneMappingExposure=day?(code>=95?.55:code>=51?.72:1.02):.5;
  const h=new Date().getHours()+new Date().getMinutes()/60,ang=(h-6)/12*Math.PI;sun.position.set(Math.cos(ang)*5,Math.max(-1,Math.sin(ang)*4),-1);sunHalo.position.copy(sun.position);const mp=moonPhase();moon.position.set(Math.cos(mp*Math.PI*2)*4.4,2.5+Math.sin(mp*Math.PI*2)*1.3,-1);moonLight.position.copy(moon.position);
 }
 window.addEventListener('skygates-live-weather',e=>apply(e.detail));if(window.__SKYGATES_LIVE__)apply(window.__SKYGATES_LIVE__);
 let last=performance.now();function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;const c=latest?.current||{},wind=clamp(+c.wind_speed_10m||4,0,80),code=+c.weather_code||0;
  cloudGroup.children.forEach(q=>{q.position.x+=q.userData.speed*(10+wind);if(q.position.x>9)q.position.x=-9});
  if(rain.visible){const p=rain.geometry.attributes.position.array;for(let i=0;i<rainCount;i++){p[i*3+1]-=dt*(6+(code>=95?8:3));p[i*3]-=dt*wind*.02;if(p[i*3+1]<-5){p[i*3+1]=7;p[i*3]=-7+Math.random()*14}}rain.geometry.attributes.position.needsUpdate=true}
  stars.rotation.z+=dt*.002;cloudGroup.rotation.y=Math.sin(now*.00005)*.025;
  if(code>=95&&now>nextFlash){flash.intensity=14+Math.random()*12;flashEnd=now+90+Math.random()*90;nextFlash=now+2500+Math.random()*5500}if(now>flashEnd)flash.intensity*=.76;
  renderer.render(scene,camera);requestAnimationFrame(frame)}requestAnimationFrame(frame);ctx={renderer,scene,camera,apply};
}
function seek(){const w=document.querySelector('.v022-world');if(w)build(w)}
window.addEventListener('skygates-world-ready',e=>build(e.detail?.world));new MutationObserver(seek).observe(document.documentElement,{childList:true,subtree:true});seek();
