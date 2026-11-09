/* EARENDEL public publishing bridge */
(function(){
  const URL=window.EARENDEL_SUPABASE_URL;
  const KEY=window.EARENDEL_SUPABASE_ANON_KEY;
  if(!URL||!KEY||!window.supabase){console.warn("EARENDEL publishing is not configured.");return;}
  const db=window.supabase.createClient(URL,KEY);
  const path=location.pathname.split("/").pop()||"index.html";
  const pages={
    "poetry.html":{category:"Poetry",grid:"#poetryGrid",heading:"New Words, Just Published",sub:"Fresh poetry from the EARENDEL editorial desk."},
    "stories.html":{category:"Stories",grid:"#storyGrid",heading:"New Stories, Just Published",sub:"Discover the latest stories from EARENDEL."},
    "novels.html":{category:"Novels",grid:"#bookGrid",heading:"New Chapters & Novels",sub:"Explore the latest literary journeys."},
    "quotes.html":{category:"Quotes",grid:"#quoteGrid",heading:"Thoughts, Just Published",sub:"A fresh collection of words to remember."}
  };
  const isHome=path==="index.html"||path==="";
  const config=pages[path];
  if(!config&&!isHome)return;

  const style=document.createElement("style");
  style.textContent=`
    .earendel-live-section{margin:38px auto 54px;max-width:1180px;padding:0 22px}
    .earendel-live-head{margin-bottom:22px}
    .earendel-live-kicker{font:600 10px Inter,Arial,sans-serif;letter-spacing:3px;color:#c7a568;text-transform:uppercase;margin-bottom:9px}
    .earendel-live-title{font:600 clamp(27px,4vw,42px) 'Cormorant Garamond',Georgia,serif;color:#f4efe5;margin:0 0 7px}
    .earendel-live-sub{color:#aaa397;font:13px/1.7 Inter,Arial,sans-serif;margin:0}
    .earendel-live-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(235px,1fr));gap:18px}
    .earendel-live-card{background:linear-gradient(145deg,#191713,#100f0d);border:1px solid rgba(199,165,104,.22);border-radius:12px;overflow:hidden;display:flex;flex-direction:column;min-width:0;transition:transform .25s,border-color .25s}
    .earendel-live-card:hover{transform:translateY(-5px);border-color:rgba(199,165,104,.65)}
    .earendel-live-cover{height:185px;background:linear-gradient(135deg,#3a2b20,#15120f);overflow:hidden}
    .earendel-live-cover img{width:100%;height:100%;object-fit:cover;display:block}
    .earendel-live-body{padding:20px;display:flex;flex:1;flex-direction:column}
    .earendel-live-category{font:600 9px Inter,Arial,sans-serif;letter-spacing:2px;color:#c7a568;text-transform:uppercase}
    .earendel-live-card h3{font:600 26px 'Cormorant Garamond',Georgia,serif;color:#f4efe5;margin:10px 0}
    .earendel-live-card p{font:13px/1.8 Inter,Arial,sans-serif;color:#aaa397;margin:0 0 18px;white-space:pre-line}
    .earendel-live-read{margin-top:auto;align-self:flex-start;border:1px solid rgba(199,165,104,.5);border-radius:5px;padding:9px 13px;background:transparent;color:#d8bd8b;font:600 9px Inter,Arial,sans-serif;letter-spacing:1.5px;cursor:pointer}
    .earendel-live-read:hover{background:#c7a568;color:#17120a}
    .earendel-live-modal{position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.82);display:none;align-items:center;justify-content:center;padding:20px}
    .earendel-live-modal.open{display:flex}
    .earendel-live-dialog{width:min(720px,100%);max-height:85vh;overflow:auto;background:#15130f;border:1px solid rgba(199,165,104,.4);border-radius:12px;padding:clamp(24px,5vw,48px);position:relative}
    .earendel-live-close{position:absolute;right:17px;top:12px;background:none;border:0;color:#d8bd8b;font-size:30px;cursor:pointer}
    .earendel-live-dialog h2{font:600 clamp(30px,5vw,44px) 'Cormorant Garamond',Georgia,serif;color:#f4efe5;margin:14px 35px 20px 0}
    .earendel-live-content{color:#e4dccf;font:15px/2 Inter,Arial,sans-serif;white-space:pre-wrap;overflow-wrap:anywhere}
    .earendel-live-date{color:#c7a568;font:10px Inter,Arial,sans-serif;letter-spacing:1.5px;margin-bottom:18px}
    @media(max-width:600px){.earendel-live-section{padding:0 5%;margin:28px auto 42px}.earendel-live-grid{grid-template-columns:1fr}.earendel-live-cover{height:210px}}
  `;
  document.head.appendChild(style);

  function makeSection(){
    const section=document.createElement("section");
    section.className="earendel-live-section";
    section.innerHTML='<div class="earendel-live-head"><div class="earendel-live-kicker">FROM THE EARENDEL EDITORIAL DESK</div><h2 class="earendel-live-title"></h2><p class="earendel-live-sub"></p></div><div class="earendel-live-grid"></div>';
    return section;
  }
  const section=makeSection();
  const target=config?document.querySelector(config.grid):null;
  if(config){
    if(!target)return;
    section.querySelector(".earendel-live-title").textContent=config.heading;
    section.querySelector(".earendel-live-sub").textContent=config.sub;
    target.parentNode.insertBefore(section,target);
  }else{
    const main=document.querySelector("main");
    if(!main)return;
    section.querySelector(".earendel-live-title").textContent="The Latest from EARENDEL";
    section.querySelector(".earendel-live-sub").textContent="New writing, published directly from our editorial desk.";
    const closing=main.lastElementChild;
    main.insertBefore(section,closing||null);
  }

  const modal=document.createElement("div");
  modal.className="earendel-live-modal";
  modal.innerHTML='<article class="earendel-live-dialog" role="dialog" aria-modal="true"><button class="earendel-live-close" aria-label="Close">×</button><div class="earendel-live-kicker">EARENDEL • A WORLD BEYOND WORDS</div><h2></h2><div class="earendel-live-date"></div><div class="earendel-live-content"></div></article>';
  document.body.appendChild(modal);
  const close=()=>modal.classList.remove("open");
  modal.querySelector(".earendel-live-close").addEventListener("click",close);
  modal.addEventListener("click",e=>{if(e.target===modal)close();});
  document.addEventListener("keydown",e=>{if(e.key==="Escape")close();});

  function openPost(post){
    modal.querySelector("h2").textContent=post.title||"Untitled";
    modal.querySelector(".earendel-live-date").textContent=(post.category||"EARENDEL").toUpperCase()+"  •  "+new Date(post.published_at||post.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"long",year:"numeric"});
    modal.querySelector(".earendel-live-content").textContent=post.content||post.excerpt||"";
    modal.classList.add("open");
  }
  function card(post){
    const article=document.createElement("article");
    article.className="earendel-live-card";
    if(post.cover_image_url){
      const cover=document.createElement("div");cover.className="earendel-live-cover";
      const img=document.createElement("img");img.src=post.cover_image_url;img.alt=post.title||"EARENDEL cover";img.loading="lazy";cover.appendChild(img);article.appendChild(cover);
    }
    const body=document.createElement("div");body.className="earendel-live-body";
    const category=document.createElement("div");category.className="earendel-live-category";category.textContent=post.category||"EARENDEL";
    const title=document.createElement("h3");title.textContent=post.title||"Untitled";
    const excerpt=document.createElement("p");excerpt.textContent=post.excerpt||((post.content||"").slice(0,145)+(post.content&&post.content.length>145?"…":""));
    const button=document.createElement("button");button.className="earendel-live-read";button.textContent=post.category==="Quotes"?"READ QUOTE ↗":"READ MORE ↗";button.addEventListener("click",()=>openPost(post));
    body.append(category,title,excerpt,button);article.appendChild(body);return article;
  }

  (async()=>{
    let query=db.from("posts").select("id,title,category,excerpt,content,cover_image_url,created_at,published_at").eq("status","published").order("published_at",{ascending:false});
    if(config)query=query.eq("category",config.category);
    else query=query.limit(4);
    const {data,error}=await query;
    if(error){console.error("EARENDEL posts could not be loaded:",error.message);section.remove();return;}
    if(!data||!data.length){section.remove();return;}
    const grid=section.querySelector(".earendel-live-grid");
    data.forEach(post=>grid.appendChild(card(post)));
  })();
})();