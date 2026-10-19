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
  }</nav><div class="hact"><a class="signin" data-wl href="#waitlist">${user}Sign In</a><a class="btn sm" data-wl href="#waitlist">Get Started</a></div></div></header>`;
  const mail=l=>l.href==="mailto:"?"mailto:"+site.contactEmail:l.href;
  document.getElementById("site-footer").innerHTML=`<footer><div class="wrap"><div class="fgrid"><div><a class="brand" href="index.html">${logo}</a><p class="blurb">${esc(site.footerBlurb)}</p></div>
  <div class="fcols">${site.footerColumns.map(c=>`<div><h4>${esc(c.title)}</h4>${c.links.map(l=>`<a href="${esc(mail(l))}" ${l.href==="#waitlist"?"data-wl":""}>${esc(l.label)}</a>`).join("")}</div>`).join("")}</div></div>
  <div class="fbot"><span>© ${new Date().getFullYear()} ${esc(site.name)}. ${esc(site.tagline)}</span></div></div></footer>`;
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
init();
