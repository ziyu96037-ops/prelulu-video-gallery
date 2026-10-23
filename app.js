const groups=[{id:1,title:'Signing Event',english:'THE SIGNING EVENT',description:'Meet the man from your story, just across the table.',count:4},{id:2,title:'After Midnight',english:'AFTER MIDNIGHT',description:'Late nights. Quiet words. An opening line just for you.',count:3},{id:3,title:'Pop Star Boyfriend',english:'THE POP STAR',description:'From the spotlight to a world made for two.',count:3}];
const pad=n=>String(n).padStart(2,'0');
const formatTime=t=>`${Math.floor(t/60)}:${pad(Math.round(t)%60)}`;
const videos=window.GALLERY_DATA;
document.getElementById('total-duration').textContent=formatTime(videos.reduce((n,v)=>n+v.duration,0))+' TOTAL RUNTIME';
const playSVG='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3v18l16-9z"/></svg>';
document.getElementById('collections').innerHTML=groups.map(g=>`<section class="collection" data-group="${g.id}" aria-labelledby="group-${g.id}"><div class="section-heading"><span class="section-number">${pad(g.id)}</span><div><h2 id="group-${g.id}">${g.title}</h2><p>${g.description}</p></div><span class="section-count">${pad(g.count)} VIDEOS</span></div><div class="grid">${videos.filter(v=>v.group===g.id).map(v=>`<button class="video-card" data-video="${v.id}" aria-label="Play: ${v.title}"><div class="poster"><img src="${v.poster}" alt="${v.title} video cover" loading="${v.id<=4?'eager':'lazy'}" width="300" height="525"><span class="video-number">${pad(v.id)}</span><span class="play-icon">${playSVG}</span><span class="duration">${formatTime(v.duration)}</span></div><div class="card-title"><span>${v.title}</span><span aria-hidden="true">↗</span></div><div class="card-subtitle">${v.description}</div></button>`).join('')}</div></section>`).join('');
document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});document.querySelectorAll('.collection').forEach(s=>s.hidden=button.dataset.filter!=='all'&&s.dataset.group!==button.dataset.filter)}));
const dialog=document.getElementById('player-dialog'),player=document.getElementById('player'),status=document.getElementById('playback-status');let current=0;
function openVideo(id){
 const v=videos.find(v=>v.id===id);current=videos.indexOf(v);const group=groups.find(g=>g.id===v.group);player.pause();player.src=v.src;player.poster=v.poster;status.textContent='';
 document.getElementById('player-category').textContent=`SERIES ${pad(v.group)} / ${group.english}`;
 document.getElementById('player-title').textContent=v.title;document.getElementById('player-description').textContent=v.description;
 document.getElementById('player-meta').textContent=`${formatTime(v.duration)} · ${v.width} × ${v.height} · ${(v.size/1024/1024).toFixed(1)} MB`;
 const download=document.getElementById('download');download.href=v.src;download.download=`${pad(v.id)}-${v.title}.mp4`;
 document.getElementById('playlist-count').textContent=pad(group.count);
 document.getElementById('playlist').innerHTML=videos.filter(x=>x.group===v.group).map(x=>`<button class="playlist-item ${x.id===v.id?'selected':''}" data-video="${x.id}" ${x.id===v.id?'aria-current="true"':''}><img src="${x.poster}" alt=""><span>${x.title}<small>${formatTime(x.duration)} ${x.id===v.id?' · Now playing':''}</small></span></button>`).join('');
 document.getElementById('position').textContent=`${pad(current+1)} / 10`;document.getElementById('previous').disabled=current===0;document.getElementById('next').disabled=current===videos.length-1;
 if(!dialog.open){dialog.showModal();document.body.style.overflow='hidden'}
 player.play().catch(e=>{if(e.name!=='AbortError')status.textContent='Press play on the video to start watching.'});
}
document.addEventListener('click',e=>{const card=e.target.closest('[data-video]');if(card)openVideo(Number(card.dataset.video))});
document.getElementById('close-player').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
dialog.addEventListener('close',()=>{player.pause();player.removeAttribute('src');player.load();document.body.style.overflow=''});
document.getElementById('previous').addEventListener('click',()=>{if(current>0)openVideo(videos[current-1].id)});document.getElementById('next').addEventListener('click',()=>{if(current<videos.length-1)openVideo(videos[current+1].id)});
document.addEventListener('keydown',e=>{if(!dialog.open||e.target===player||/INPUT|TEXTAREA/.test(e.target.tagName))return;if(e.key==='ArrowLeft'&&current>0){e.preventDefault();openVideo(videos[current-1].id)}if(e.key==='ArrowRight'&&current<videos.length-1){e.preventDefault();openVideo(videos[current+1].id)}});
player.addEventListener('error',()=>{if(player.hasAttribute('src'))status.textContent='Unable to load this video. Try opening it again, or download it to watch.'});
