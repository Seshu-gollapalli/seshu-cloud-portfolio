(()=> {
const canvas=document.getElementById('hero-webgl'); if(!canvas||!window.THREE)return;
const T=window.THREE, reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let renderer,scene,camera,group,raf;
try {
renderer=new T.WebGLRenderer({canvas,alpha:true,antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6)); renderer.setClearColor(0,0);
scene=new T.Scene(); camera=new T.PerspectiveCamera(42,1,.1,100); camera.position.z=14;
group=new T.Group(); scene.add(group);
scene.add(new T.AmbientLight(0x899cff,1.1));
let pink=new T.PointLight(0xff238d,2.8,24); pink.position.set(4,2,4); scene.add(pink);
let blue=new T.PointLight(0x278cff,2.5,24); blue.position.set(-5,-1,3); scene.add(blue);
[{r:3.35,c:0xff3ba7,x:.3,y:.15,z:.1},{r:4.05,c:0x548cff,x:1.03,y:.16,z:-.22},{r:2.65,c:0xa65bff,x:1.3,y:.42,z:.3}].forEach((s,i)=>{
let m=new T.Mesh(new T.TorusGeometry(s.r,.012,8,180),new T.MeshBasicMaterial({color:s.c,transparent:true,opacity:i===0?.72:.52}));
m.rotation.set(s.x,s.y,s.z); m.userData.ring=i; group.add(m);
});
const core=new T.Group(), mat=new T.MeshStandardMaterial({color:0x9d73ff,emissive:0x4316a8,emissiveIntensity:1.7,metalness:.45,roughness:.25,transparent:true,opacity:.78});
[[-.48,0,0,.48],[0,.23,0,.63],[.52,.02,0,.43],[.1,-.18,.02,.48]].forEach(v=>{let m=new T.Mesh(new T.SphereGeometry(v[3],22,16),mat);m.position.set(v[0],v[1],v[2]);core.add(m)});
core.position.set(2.5,.15,-.6);core.scale.setScalar(.66);group.add(core);
const ps=[[-4.6,1.8,-.5],[-3.3,-1.4,.2],[-1.8,2.4,-1.1],[0,-2.2,-.4],[1.4,2.4,-.8],[4.4,1.65,-.7],[4.5,-1.5,-.1],[.5,.7,1.2],[-4.4,-2.2,-.9],[2.8,-2.35,-.8]];
ps.forEach((p,i)=>{let m=new T.Mesh(new T.SphereGeometry(i%3===0?.055:.035,12,12),new T.MeshBasicMaterial({color:i%2?0x6d9dff:0xff4cae}));m.position.set(...p);group.add(m)});
[[0,2],[2,4],[4,5],[5,6],[6,9],[9,3],[3,1],[1,8],[2,7],[7,6],[7,3]].forEach(([a,b],i)=>{
let g=new T.BufferGeometry().setFromPoints([new T.Vector3(...ps[a]),new T.Vector3(...ps[b])]);
group.add(new T.Line(g,new T.LineBasicMaterial({color:i%2?0x8c58ff:0x3c83ff,transparent:true,opacity:.24})));
});
let count=550,pos=new Float32Array(count*3),col=new Float32Array(count*3);
for(let i=0;i<count;i++){pos[i*3]=(Math.random()-.5)*15;pos[i*3+1]=(Math.random()-.5)*8;pos[i*3+2]=(Math.random()-.5)*7-1.5;let p=Math.random()>.68;col[i*3]=p?1:.32;col[i*3+1]=p?.22:.48;col[i*3+2]=p?.65:1}
let pg=new T.BufferGeometry();pg.setAttribute('position',new T.BufferAttribute(pos,3));pg.setAttribute('color',new T.BufferAttribute(col,3));
let points=new T.Points(pg,new T.PointsMaterial({size:.022,vertexColors:true,transparent:true,opacity:.62,depthWrite:false}));group.add(points);
let tx=0,ty=0,x=0,y=0;
addEventListener('pointermove',e=>{tx=(e.clientX/innerWidth-.5)*.55;ty=(e.clientY/innerHeight-.5)*.32},{passive:true});
function resize(){let r=canvas.parentElement.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);camera.aspect=r.width/Math.max(1,r.height);camera.updateProjectionMatrix()}
new ResizeObserver(resize).observe(canvas.parentElement);resize();
let clock=new T.Clock();
function animate(){raf=requestAnimationFrame(animate);let t=clock.getElapsedTime();if(!reduced){x+=(tx-x)*.025;y+=(ty-y)*.025;group.rotation.y=.045*Math.sin(t*.16)+x*.12;group.rotation.x=.025*Math.cos(t*.13)+y*.08;group.position.y=.05*Math.sin(t*.45);group.children.forEach(o=>{if(o.userData.ring!==undefined)o.rotation.z+=.0008*(o.userData.ring+1)});core.rotation.y=t*.13;core.rotation.z=Math.sin(t*.32)*.08;points.rotation.y=t*.008}renderer.render(scene,camera)}
animate();document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(raf);else animate()});
}catch(e){canvas.style.display='none';console.warn('WebGL fallback active',e)}
})();