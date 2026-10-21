/* InfoPouch Africa: shared header/footer, blog and waitlist. Content lives in /data/*.json */
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const fmt=d=>new Date(d+"T00:00:00").toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});
const here=(location.pathname.split("/").pop()||"index.html");
const get=u=>fetch(u).then(r=>r.json());

async function init(){
  const site=await get("data/site.json");
  const logo=(site.logo?`<img src="${esc(site.logo)}" alt="" onerror="this.remove()">`:"")+`<span>${esc(site.name)}</span>`;
  const user='<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="10" cy="10" r="8.5"/><circle cx="10" cy="8" r="3"/><path d="M4.5 16c1.2-2.2 3.2-3 5.5-3s4.3.8 5.5 3"/></svg>';
  document.getElementById("site-header").innerHTML=`<header><div class="wrap"><a class="brand" href="index.html">${logo}</a><nav>${
    site.nav.map(n=>`<a href="${n.href}" class="${n.href===here||(here==="post.html"&&n.href==="blog.html")?"on":""}">${esc(n.label)}</a>`).join("")
  }</nav><div class="hact"><button class="theme-btn" id="theme" aria-label="Switch between light and dark mode" title="Light / dark"><svg class="sun-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg><svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z"/></svg></button><a class="signin" data-wl href="#waitlist">${user}Sign In</a><a class="btn sm" data-wl href="#waitlist">Get Started</a></div></div></header>`;
  const mail=l=>l.href==="mailto:"?"mailto:"+site.contactEmail:l.href;
  document.getElementById("site-footer").innerHTML=`<footer><div class="wrap"><div class="fgrid"><div><a class="brand" href="index.html">${logo}</a><p class="blurb">${esc(site.footerBlurb)}</p></div>
  <div class="fcols">${site.footerColumns.map(c=>`<div><h4>${esc(c.title)}</h4>${c.links.map(l=>`<a href="${esc(mail(l))}" ${l.href==="#waitlist"?"data-wl":""}>${esc(l.label)}</a>`).join("")}</div>`).join("")}</div></div>
  <div class="fbot"><span>© ${new Date().getFullYear()} ${esc(site.name)}. ${esc(site.tagline)}</span><span class="legal">${(site.legalLinks||[]).map(l=>`<a href="${esc(l.href)}">${esc(l.label)}</a>`).join("")}</span>${(site.photoCredits||[]).length?`<span class="credits">Photos by ${site.photoCredits.map(c=>`<a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.name)}</a>`).join(", ")} on <a href="https://unsplash.com" target="_blank" rel="noopener">Unsplash</a></span>`:""}</div></div></footer>`;
  document.querySelectorAll("[data-wl]").forEach(a=>{if(site.waitlistUrl){a.href=site.waitlistUrl;a.target="_blank";a.rel="noopener"}else a.href="mailto:"+site.contactEmail});

  const posts=(await get("data/posts.json")).sort((a,b)=>b.date.localeCompare(a.date));
  const list=document.getElementById("posts");
  if(list)list.innerHTML=posts.map(p=>`<article class="card post"><div class="art" ${p.image?`style="background-image:url('${esc(p.image)}')"`:""}><span>${esc(p.category)}</span></div>
    <h3>${esc(p.title)}</h3><div class="meta">${esc(p.author)} · ${fmt(p.date)}</div><p>${esc(p.excerpt)}</p><a class="more" href="post.html?slug=${encodeURIComponent(p.slug)}">Read Article →</a></article>`).join("");
  const el=document.getElementById("post");
  if(el){const p=posts.find(x=>x.slug===new URLSearchParams(location.search).get("slug"));
    if(!p)el.innerHTML="<h2>Article not found</h2><p style='text-align:center'><a class='btn' href='blog.html'>Back to Blog</a></p>";
    else{document.title=p.title+" | "+site.name;el.innerHTML=`<span class="tag">${esc(p.category)}</span><h1 style="font-size:clamp(30px,5vw,48px);margin:10px 0">${esc(p.title)}</h1><div class="meta">${esc(p.author)} · ${fmt(p.date)}</div>${p.body.map(x=>`<p>${x}</p>`).join("")}<p><a class="btn" href="blog.html">← Back to Blog</a></p>`}}
}
init().then(()=>{fx();fx2()});
function fx2(){
  if(matchMedia("(prefers-reduced-motion:reduce)").matches)return;
  // drifting network particles over heroes
  document.querySelectorAll(".hero:not(.dark)").forEach(h=>{
    const c=document.createElement("canvas");c.className="fx-canvas";h.insertBefore(c,h.querySelector(".wrap"));
    const x=c.getContext("2d");let W,H,pts=[],mx=-999,my=-999,vis=true;
    const size=()=>{W=c.width=h.clientWidth;H=c.height=h.clientHeight;const n=innerWidth<900?22:Math.round(W*H/16000);pts=Array.from({length:n},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,g:Math.random()<.25}))};
    size();addEventListener("resize",size);
    h.addEventListener("mousemove",e=>{const r=h.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top});h.addEventListener("mouseleave",()=>{mx=my=-999});
    new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(h);
    (function t(){requestAnimationFrame(t);if(!vis)return;x.clearRect(0,0,W,H);
      for(const p of pts){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
        const dx=p.x-mx,dy=p.y-my,d=Math.hypot(dx,dy);if(d<130){p.x+=dx/d*1.4;p.y+=dy/d*1.4}
        x.beginPath();x.arc(p.x,p.y,p.g?2.6:1.8,0,6.3);const dk=document.documentElement.getAttribute("data-theme")==="dark";x.fillStyle=p.g?"rgba(244,185,78,.9)":(dk?"rgba(255,255,255,.55)":"rgba(105,14,47,.55)");x.fill()}
      for(let i=0;i<pts.length;i++)for(let k=i+1;k<pts.length;k++){const a=pts[i],b=pts[k],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<120){x.strokeStyle=(document.documentElement.getAttribute("data-theme")==="dark"?"rgba(244,185,78,":"rgba(105,14,47,")+(.22*(1-d/120))+")";x.lineWidth=1;x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke()}}
      if(mx>0)for(const p of pts){const d=Math.hypot(p.x-mx,p.y-my);if(d<170){x.strokeStyle="rgba(244,185,78,"+(.6*(1-d/170))+")";x.beginPath();x.moveTo(p.x,p.y);x.lineTo(mx,my);x.stroke()}}
    })()});
  // 3D tilt on cards
  document.querySelectorAll(".pillar,.card.feat").forEach(el=>{
    el.addEventListener("mousemove",e=>{const r=el.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(900px) rotateX(${-py*7}deg) rotateY(${px*9}deg) translateY(-8px)`});
    el.addEventListener("mouseleave",()=>el.style.transform="")});
  // spotlight in dark section
  const v=document.querySelector(".values");if(v)v.addEventListener("mousemove",e=>{const r=v.getBoundingClientRect();v.style.setProperty("--mx",e.clientX-r.left+"px");v.style.setProperty("--my",e.clientY-r.top+"px")});
  // gentle parallax on photo panels
  const ps=[...document.querySelectorAll(".panel")];
  const par=()=>ps.forEach(p=>{const r=p.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;const k=(r.top+r.height/2-innerHeight/2)/innerHeight;p.style.backgroundPositionY=`calc(50% + ${k*-40}px)`});
  addEventListener("scroll",par,{passive:true});par();
}

function fx(){
  const root=document.documentElement,tb=document.getElementById("theme");
  if(tb)tb.addEventListener("click",()=>{const d=root.getAttribute("data-theme")==="dark"?"light":"dark";root.classList.add("tt");root.setAttribute("data-theme",d);try{localStorage.setItem("ip-theme",d)}catch(e){}setTimeout(()=>root.classList.remove("tt"),600)});
  document.documentElement.classList.add("js");
  const bar=document.createElement("div");bar.id="progress";document.body.appendChild(bar);
  const hd=document.querySelector("header");
  const onS=()=>{const h=document.documentElement,m=h.scrollHeight-innerHeight;bar.style.width=(m>0?scrollY/m*100:0)+"%";hd&&hd.classList.toggle("scrolled",scrollY>20)};
  addEventListener("scroll",onS,{passive:true});onS();
  document.querySelectorAll(".hero:not(.dark)").forEach(h=>{h.insertAdjacentHTML("afterbegin",'<div class="hero-map" aria-hidden="true"></div><div class="hero-glow g1"></div><div class="hero-glow g2"></div>');
    const g=h.querySelector(".g1"),g2=h.querySelector(".g2");
    h.addEventListener("mousemove",e=>{const r=h.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;g.style.translate=x*120+"px "+y*80+"px";g2.style.translate=x*-140+"px "+y*-90+"px"})});
  const sel=".pillar,.card,.post,.split>*,.faq details,.tagline,section h2,.wl .wrap>*,.about-body p,.panel";
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12});
  document.querySelectorAll(sel).forEach((el,i)=>{el.classList.add("rv");el.style.setProperty("--d",(i%4)*.09+"s");io.observe(el)});
  const m=document.createElement("div");m.id="vmodal";m.innerHTML='<div class="box" role="dialog" aria-modal="true"><button aria-label="Close">×</button><h3></h3><p class="a"></p><p class="b"></p></div>';document.body.appendChild(m);
  const close=()=>m.classList.remove("open");
  m.addEventListener("click",e=>{if(e.target===m||e.target.tagName==="BUTTON")close()});
  addEventListener("keydown",e=>{if(e.key==="Escape")close()});
  document.querySelectorAll(".v").forEach(v=>{const open=()=>{m.querySelector("h3").textContent=v.querySelector("h3").textContent;m.querySelector(".a").textContent=v.querySelector("p").textContent;m.querySelector(".b").textContent=v.dataset.more||"";m.classList.add("open")};
    v.addEventListener("click",open);v.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();open()}})});
}
