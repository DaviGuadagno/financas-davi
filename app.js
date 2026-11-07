const APP_VER=8;

/* ---------- utilidades ---------- */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const brl=c=>((c||0)/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const brlShort=c=>{const v=(c||0)/100;return Math.abs(v)>=1000?'R$ '+(v/1000).toLocaleString('pt-BR',{maximumFractionDigits:1})+' mil':'R$ '+Math.round(v).toLocaleString('pt-BR')};
const compact=c=>{const v=(c||0)/100;return v>=1000?(v/1000).toLocaleString('pt-BR',{maximumFractionDigits:1})+' mil':Math.round(v).toLocaleString('pt-BR')};
const pad=n=>String(n).padStart(2,'0');
function parseMoney(s){s=String(s??'').replace(/[^\d,.\-]/g,'');if(!s)return null;
  if(s.includes(','))s=s.replace(/\./g,'').replace(',','.');else if(/^\d{1,3}(\.\d{3})+$/.test(s))s=s.replace(/\./g,'');
  const v=parseFloat(s);return isNaN(v)?null:Math.round(v*100)}
const moneyInput=c=>c==null?'':(c/100).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
const now=new Date(), TODAY=`${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`, CUR=TODAY.slice(0,7);
const MES=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
const addM=(k,n)=>{let [y,m]=k.split('-').map(Number);const t=y*12+(m-1)+n;return `${Math.floor(t/12)}-${pad(t%12+1)}`};
const diffM=(a,b)=>{const [y1,m1]=a.split('-').map(Number),[y2,m2]=b.split('-').map(Number);return (y2-y1)*12+m2-m1};
const dim=k=>{const [y,m]=k.split('-').map(Number);return new Date(y,m,0).getDate()};
const clampDay=(k,d)=>`${k}-${pad(Math.min(d,dim(k)))}`;
const mShort=k=>{const [y,m]=k.split('-');return MES[+m-1].slice(0,3)+'/'+y.slice(2)};
const mLong=k=>{const [y,m]=k.split('-');return MES[+m-1]+' de '+y};
const dBr=d=>d?`${d.slice(8,10)}/${d.slice(5,7)}`:'';
const addDays=(iso,n)=>{const [y,m,d]=iso.split('-').map(Number);const t=new Date(y,m-1,d+n);return `${t.getFullYear()}-${pad(t.getMonth()+1)}-${pad(t.getDate())}`};
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,8);
const ls={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch{return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}};
const ICON={painel:'<path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/>',lista:'<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',pizza:'<path d="M12 3a9 9 0 1 0 9 9h-9z"/><path d="M15 3.5A9 9 0 0 1 20.5 9H15z"/>',divida:'<path d="M3 17l6-6 4 4 8-9"/><path d="M15 6h6v6" transform="rotate(90 18 9)"/>',cartao:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18"/>',cal:'<rect x="4" y="5" width="16" height="16" rx="3"/><path d="M4 10h16M9 3v4M15 3v4"/>',plus:'<path d="M12 5v14M5 12h14"/>',left:'<path d="M15 6l-6 6 6 6"/>',right:'<path d="M9 6l6 6-6 6"/>',bell:'<path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4zM10 21h4"/>',moon:'<path d="M20 14A8 8 0 1 1 10 4a7 7 0 0 0 10 10z"/>',panel:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M10 4v16"/>',alert:'<path d="M12 4l9 16H3zM12 10v4M12 17h.01"/>',clock:'<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',up:'<path d="M12 19V5M6 11l6-6 6 6"/>',x:'<path d="M6 6l12 12M18 6L6 18"/>',clip:'<path d="M20 11l-8.5 8.5a5 5 0 0 1-7-7L13 4a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-3-3L14 7"/>',check:'<path d="M5 12l5 5 9-10"/>',down:'<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',out:'<path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4M15 8l4 4-4 4M19 12H9"/>'};
const ic=n=>`<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${ICON[n]}</svg>`;

/* ---------- categorias ---------- */
const GRUPOS={essencial:{nome:'Essenciais',cor:'var(--g1)'},nao:{nome:'Não essenciais',cor:'var(--g2)'},fin:{nome:'Financeiras',cor:'var(--g3)'}};
const CAT_D={essencial:['Moradia','Alimentação','Energia','Água','Internet e celular','Transporte','Saúde','Educação','Seguros','Cachorros'],nao:['Restaurantes','Delivery','Lazer','Assinaturas','Compras','Viagens','Casamento','Presentes','Outros'],fin:['Pagamento de dívida','Juros e multas','Tarifas e anuidade','IOF','Empréstimos']};
const CAT_R=['Salário','Pró-labore','Comissões','Trabalhos extras','Rendimentos','Reembolso','Ajuda de família','Casamento','Outras receitas'];
const MEIOS={pix:'Pix / conta',debito:'Débito',cartao:'Crédito',dinheiro:'Dinheiro',boleto:'Boleto'};

/* ---------- estado ---------- */
const S={tx:[],debts:[],cards:[],cfg:{},loaded:{tx:false,debts:false,cards:false},page:'painel',month:CUR,fTipo:'todos',fCat:'',fStatus:'',fText:'',sel:{},day:null,strategy:null,offline:false,unreach:false,planMonths:null};
const PAGES=[['painel','Painel','painel'],['lancamentos','Lançamentos','lista'],['para-onde-vai','Para onde vai','pizza'],['dividas','Dívidas','divida'],['cartoes','Cartões','cartao'],['proximos-meses','Próximos meses','cal']];
const groupOf=(tx)=>{if(tx.grupo)return tx.grupo;for(const g in CAT_D)if(CAT_D[g].includes(tx.categoria))return g;return 'nao'};

/* ---------- regras: parcelas, fatura, ocorrências ---------- */
function faturaDue(iso,card){ // data da compra -> vencimento da fatura em que ela entra
  const k=iso.slice(0,7),d=+iso.slice(8,10);
  const closeK=d<card.fecha?k:addM(k,1);
  const dueK=card.venc>card.fecha?closeK:addM(closeK,1);
  return clampDay(dueK,card.venc)}
function parcelaCents(tx,i){const N=tx.parcelas||1;if(tx.valorBase==='parcela')return tx.valorCents;
  const base=Math.floor(tx.valorCents/N);return i<N?base:tx.valorCents-base*(N-1)}
function firstDate(tx){const card=tx.cartaoId&&S.cards.find(c=>c.id===tx.cartaoId);return card?faturaDue(tx.data,card):tx.data}
function occsOf(tx,limitKey){const out=[],start=firstDate(tx),k0=start.slice(0,7),day=+start.slice(8,10);
  const mk=(off,n,N,c)=>{const key=addM(k0,off),vr=tx.modo==='recorrente'&&tx.valorVariavel===true,inf=vr&&tx.valores?.[key]!=null;out.push({tx,key,date:clampDay(key,day),cents:inf?tx.valores[key]:c,n,N,paid:tx.pagos?.[key]===true,variavel:vr,informado:inf})};
  if(tx.modo==='parcelado'){const N=tx.parcelas||1,k=tx.parcelaInicial||1;for(let i=k;i<=N;i++)mk(i-k,i,N,parcelaCents(tx,i))}
  else if(tx.modo==='recorrente'){const end=tx.fim&&tx.fim<limitKey?tx.fim:limitKey;for(let o=0;addM(k0,o)<=end;o++)mk(o,null,null,tx.valorCents)}
  else mk(0,null,null,tx.valorCents);
  return out}
const paidIn=(d,key)=>(d.pagamentos||[]).filter(p=>p.data.slice(0,7)===key).reduce((a,p)=>a+p.valorCents,0);
function debtOccs(d,limitKey){ // previsão: só do mês atual em diante
  const out=[];if(!d.parcelaCents||d.saldoCents<=0)return out;
  const est=Math.ceil(d.saldoCents/d.parcelaCents),rest=d.parcelasRestantes??est;
  const paidNow=paidIn(d,CUR),skip=paidNow>=d.parcelaCents?1:0;
  for(let i=0;i<rest;i++){const key=addM(CUR,i+skip);if(key>limitKey)break;
    const c=i===0&&!skip?d.parcelaCents-paidNow:d.parcelaCents;
    out.push({debt:d,key,date:clampDay(key,d.venc||1),cents:c,n:null,N:null,paid:false})}
  return out}
let IDX=null;
function index(){if(IDX&&S.month<=IDX.lim)return IDX;
  const lim=addM(S.month>CUR?S.month:CUR,36),by={};const add=o=>{(by[o.key]=by[o.key]||[]).push(o)};
  S.tx.forEach(t=>occsOf(t,lim).forEach(add));S.debts.forEach(d=>debtOccs(d,lim).forEach(add));
  IDX={by,lim};return IDX}
const dirty=()=>{IDX=null};
const occs=k=>index().by[k]||[];
const tipoOf=o=>o.debt?'despesa':o.tx.tipo;
function sums(k){const r={in:0,out:0,inPaid:0,outPaid:0,parc:0,rec:0,div:0,avista:0,cat:{},grp:{essencial:0,nao:0,fin:0}};
  for(const o of occs(k)){if(tipoOf(o)==='receita'){r.in+=o.cents;if(o.paid)r.inPaid+=o.cents;continue}
    r.out+=o.cents;if(o.paid)r.outPaid+=o.cents;
    if(o.debt){r.div+=o.cents;r.grp.fin+=o.cents;r.cat['Pagamento de dívida']=(r.cat['Pagamento de dívida']||0)+o.cents;continue}
    if(o.tx.modo==='parcelado')r.parc+=o.cents;else if(o.tx.modo==='recorrente')r.rec+=o.cents;else r.avista+=o.cents;
    r.grp[groupOf(o.tx)]+=o.cents;r.cat[o.tx.categoria]=(r.cat[o.tx.categoria]||0)+o.cents}
  r.saldo=r.in-r.out;return r}
const totalDebt=()=>S.debts.reduce((a,d)=>a+Math.max(0,d.saldoCents||0),0);
function parcelasFuturas(){let t=0;for(const x of S.tx){if(x.tipo!=='despesa'||x.modo!=='parcelado')continue;for(const o of occsOf(x,'9999-12'))if(!o.paid)t+=o.cents}return t}
function attention(){const lim=addDays(TODAY,7),items=[],cardsDone={};
  const keys=Object.keys(index().by).filter(k=>k<=lim.slice(0,7)).sort();
  for(const o of occs(CUR))if(o.variavel&&!o.informado&&!o.paid)items.push({kind:'val',o,date:TODAY,cents:o.cents});
  for(const k of keys)for(const o of occs(k)){if(o.paid||o.date>lim)continue;if(k===CUR&&o.variavel&&!o.informado)continue;
    if(o.tx?.cartaoId&&S.cards.some(c=>c.id===o.tx.cartaoId))continue;
    items.push({kind:o.debt?'debt':'tx',o,date:o.date,cents:o.cents})}
  for(const c of S.cards){const open=faturasAbertas(c.id),urg=open.filter(f=>f.date<=lim),use=urg.length?urg:open.slice(0,1);for(const f of use)items.push({kind:'fatura',card:c,key:f.key,date:f.date,cents:f.cents})}
  items.sort((a,b)=>a.date.localeCompare(b.date));return items}
function faturasAbertas(cardId){const out=[];for(const k of Object.keys(index().by).sort()){let c=0,d=null;for(const o of occs(k))if(o.tx?.cartaoId===cardId&&!o.paid){c+=o.cents;d=o.date}if(c>0)out.push({key:k,date:d,cents:c})}return out}
const urgentes=at=>at.filter(a=>a.date<=addDays(TODAY,7));

/* ---------- plano de quitação ---------- */
function simulate(debts,extra,mode){ // mode: 'min' | 'juros' | 'saldo'. Valores em centavos, juros mensais.
  let L=debts.filter(d=>d.saldoCents>0).map(d=>({id:d.id,nome:d.credor,s:d.saldoCents,r:(d.jurosMes||0)/100,min:d.parcelaCents||0}));
  const res={months:0,juros:0,never:false,serie:[L.reduce((a,d)=>a+d.s,0)],payoff:{},plano:[]};
  if(!L.length)return res;
  const budget=L.reduce((a,d)=>a+d.min,0)+(mode==='min'?0:extra);
  const order=mode==='saldo'?(a,b)=>a.s-b.s:(a,b)=>b.r-a.r||a.s-b.s;
  for(let m=1;m<=600;m++){
    const act=L.filter(d=>d.s>0.5);if(!act.length)break;
    const pays={};let left=budget;
    for(const d of act){const j=d.s*d.r;d.s+=j;res.juros+=j}
    for(const d of act){const p=Math.min(d.min,d.s);d.s-=p;pays[d.id]=p;left-=p}
    if(mode!=='min'){for(const d of [...act].sort(order)){if(left<=0)break;if(d.s<=0)continue;const p=Math.min(left,d.s);d.s-=p;pays[d.id]=(pays[d.id]||0)+p;left-=p}}
    for(const d of act)if(d.s<=0.5){d.s=0;res.payoff[d.id]=m}
    res.months=m;res.serie.push(L.reduce((a,d)=>a+d.s,0));
    res.plano.push({m,pays,total:Object.values(pays).reduce((a,b)=>a+b,0),saldo:L.reduce((a,d)=>a+d.s,0),nomes:Object.fromEntries(act.map(d=>[d.id,d.nome]))})}
  if(L.some(d=>d.s>0.5)){res.never=true}
  return res}
const prazo=m=>m<12?`${m} ${m===1?'mês':'meses'}`:`${Math.floor(m/12)} ${m<24?'ano':'anos'}${m%12?` e ${m%12} ${m%12===1?'mês':'meses'}`:''}`;

/* ---------- armazenamento ---------- */
const COLS={tx:'lancamentos',debts:'dividas',cards:'cartoes'};
let store=null,unreachTimer=null;
function fireStore(fs,uid){const base=`users/${uid}`,col=k=>F_.collection(fs,base,COLS[k]);const unsub=[];return{
  watch(k,cb){unsub.push(F_.onSnapshot(col(k),{includeMetadataChanges:false},s=>cb(s.docs.map(d=>({id:d.id,...d.data()})),s.metadata.fromCache),onDbError))},
  watchCfg(cb){unsub.push(F_.onSnapshot(F_.doc(fs,base,'config','geral'),s=>cb(s.exists()?s.data():{}),onDbError))},
  put(k,id,data){return F_.setDoc(F_.doc(col(k),id),data)},
  patch(k,id,data){return F_.setDoc(F_.doc(col(k),id),data,{merge:true})},
  del(k,id){return F_.deleteDoc(F_.doc(col(k),id))},
  putAnexo(id,data){return F_.setDoc(F_.doc(fs,base,'anexos',id),data)},
  getAnexo(id){return F_.getDoc(F_.doc(fs,base,'anexos',id)).then(d=>d.exists()?d.data():null)},
  delAnexo(id){return F_.deleteDoc(F_.doc(fs,base,'anexos',id))},
  cfg(data){return F_.setDoc(F_.doc(fs,base,'config','geral'),data)},
  stop(){unsub.forEach(f=>f())}}}
function onDbError(e){console.warn(e);if(e?.code==='permission-denied'&&!retried){retried=true;setTimeout(resubscribe,800);return}S.dbErr=e?.code||'erro';S.unreach=true;render(false)}
async function write(fn,ok){try{const w=Promise.resolve(fn());if(navigator.onLine)await w;else w.catch(e=>console.warn(e));if(ok)toast(ok)}catch(e){console.warn(e);toast('Não salvou. Confira a conexão e tente de novo.')}}
const clean=o=>JSON.parse(JSON.stringify(o));

/* ---------- ações sobre dados ---------- */
const togglePaid=(tx,key,val)=>write(()=>store.patch('tx',tx.id,{pagos:{[key]:val},pagosEm:{[key]:Date.now()}}),val?(tx.tipo==='receita'?'Marcado como recebido':'Marcado como pago'):'Desmarcado');
async function payFatura(cardId,key){const list=occs(key).filter(o=>o.tx?.cartaoId===cardId&&!o.paid);for(const o of list){await write(()=>store.patch('tx',o.tx.id,{pagos:{[key]:true},pagosEm:{[key]:Date.now()}}))}toast('Fatura marcada como paga')}
async function saveDebtPayment(d,valor,data,novoSaldo){const txId=uid();
  await write(()=>store.put('tx',txId,clean({tipo:'despesa',descricao:'Pagamento: '+d.credor,modo:'avista',valorCents:valor,data,categoria:'Pagamento de dívida',grupo:'fin',meio:'pix',pagos:{[data.slice(0,7)]:true},pagosEm:{[data.slice(0,7)]:Date.now()},debtId:d.id,criadoEm:Date.now()})));
  const pg=[...(d.pagamentos||[]),{txId,data,valorCents:valor,saldoAntes:d.saldoCents}];
  const patch={saldoCents:Math.max(0,novoSaldo),pagamentos:pg};
  if(d.parcelasRestantes!=null&&d.parcelaCents&&valor>=d.parcelaCents)patch.parcelasRestantes=Math.max(0,d.parcelasRestantes-1);
  await write(()=>store.patch('debts',d.id,patch),'Pagamento registrado');}
async function deleteTx(tx){
  if(tx.debtId){const d=S.debts.find(x=>x.id===tx.debtId);if(d){const p=(d.pagamentos||[]).find(i=>i.txId===tx.id);
    if(p)await write(()=>store.patch('debts',d.id,{saldoCents:p.saldoAntes??(d.saldoCents+p.valorCents),pagamentos:d.pagamentos.filter(i=>i.txId!==tx.id)}))}}
  for(const a of (tx.anexos||[]))write(()=>store.delAnexo(a.id));
  await write(()=>store.del('tx',tx.id),'Lançamento excluído')}

/* ---------- gráficos ---------- */
function niceMax(v){if(v<=0)return 10000;const e=Math.pow(10,Math.floor(Math.log10(v))),f=v/e;return (f<=1?1:f<=2?2:f<=2.5?2.5:f<=5?5:10)*e}
function roundedTop(x,y,w,h,r=4){if(h<=0)return '';r=Math.min(r,w/2,h);return `M${x},${y+h}V${y+r}Q${x},${y} ${x+r},${y}H${x+w-r}Q${x+w},${y} ${x+w},${y+r}V${y+h}Z`}
function drawFlow(el){const W=el.clientWidth||600,H=Math.max(232,el.clientHeight||0),narrow=W<560;
  const from=addM(CUR,narrow?-2:-5),n=narrow?6:12,keys=Array.from({length:n},(_,i)=>addM(from,i));
  const d=keys.map(k=>({k,...sums(k)}));const max=niceMax(Math.max(...d.flatMap(x=>[x.in,x.out])));
  const L=64,B=22,T=8,pw=W-L-4,ph=H-T-B,bw=pw/n,y=v=>T+ph-(v/max)*ph;let g='';
  for(let i=0;i<=4;i++){const v=max*i/4;g+=`<line class="gl" x1="${L}" x2="${W}" y1="${y(v)}" y2="${y(v)}"/><text x="${L-7}" y="${y(v)+4}" text-anchor="end">${brlShort(v)}</text>`}
  const tw=Math.min(13,(bw-10)/2);
  d.forEach((m,i)=>{const x=L+i*bw,c=x+bw/2,fut=m.k>CUR,op=fut?.5:1;
    g+=`<g class="col ${m.k===S.month?'sel':''}"><rect class="hit" x="${x+1}" y="${T}" width="${bw-2}" height="${ph+B}" rx="8" data-act="month" data-k="${m.k}" tabindex="0" role="button" aria-label="${mLong(m.k)}" data-tip="${esc(`${mLong(m.k)}${fut?' (previsão)':''}\nEntradas: ${brl(m.in)}\nSaídas: ${brl(m.out)}\nSaldo: ${brl(m.saldo)}`)}"/>`+
      `<path d="${roundedTop(c-tw-1,y(m.in),tw,T+ph-y(m.in))}" fill="var(--s-in)" opacity="${op}" pointer-events="none"/><path d="${roundedTop(c+1,y(m.out),tw,T+ph-y(m.out))}" fill="var(--s-out)" opacity="${op}" pointer-events="none"/>`+
      `<text x="${c}" y="${H-6}" text-anchor="middle" pointer-events="none" ${m.k===CUR?'style="fill:var(--fg);font-weight:600"':''}>${mShort(m.k).split('/')[0]}</text></g>`});
  el.innerHTML=`<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Entradas e saídas por mês">${g}</svg>`+(d.every(m=>!m.in&&!m.out)?'<div class="chart-empty">O gráfico aparece no primeiro lançamento.</div>':'')}
function drawGroups(el){const W=el.clientWidth||600,H=220,n=W<520?4:6,keys=Array.from({length:n},(_,i)=>addM(S.month,i-n+1));
  const d=keys.map(k=>({k,...sums(k)}));const max=niceMax(Math.max(...d.map(x=>x.out)));
  const L=64,B=22,T=6,pw=W-L-4,ph=H-T-B,bw=pw/n,y=v=>T+ph-(v/max)*ph,tw=Math.min(34,bw*.5);let g='';
  for(let i=0;i<=4;i++){const v=max*i/4;g+=`<line class="gl" x1="${L}" x2="${W}" y1="${y(v)}" y2="${y(v)}"/><text x="${L-7}" y="${y(v)+4}" text-anchor="end">${brlShort(v)}</text>`}
  d.forEach((m,i)=>{const x=L+i*bw,c=x+bw/2;let acc=0,segs='';const ks=['essencial','nao','fin'],top=ks.filter(k=>m.grp[k]>0).pop();
    for(const k of ks){const v=m.grp[k];if(!v)continue;const h=(v/max)*ph,yy=y(acc+v);segs+=k===top?`<path d="${roundedTop(c-tw/2,yy,tw,Math.max(h-(acc?2:0),1))}" fill="${GRUPOS[k].cor}" pointer-events="none"/>`:`<rect x="${c-tw/2}" y="${yy}" width="${tw}" height="${Math.max(h-(acc?2:0),1)}" fill="${GRUPOS[k].cor}" pointer-events="none"/>`;acc+=v}
    g+=`<g class="col ${m.k===S.month?'sel':''}"><rect class="hit" x="${x+1}" y="${T}" width="${bw-2}" height="${ph+B}" rx="8" data-act="month" data-k="${m.k}" data-tip="${esc(`${mLong(m.k)}\nEssenciais: ${brl(m.grp.essencial)}\nNão essenciais: ${brl(m.grp.nao)}\nFinanceiras: ${brl(m.grp.fin)}`)}"/>${segs}<text x="${c}" y="${H-6}" text-anchor="middle" pointer-events="none">${mShort(m.k)}</text></g>`});
  el.innerHTML=`<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Gastos por grupo nos últimos meses">${g}</svg>`+(d.every(m=>!m.out)?'<div class="chart-empty">Sem despesas nesse período.</div>':'')}
function drawPlan(el){const res=S.planSim;if(!res)return;const W=el.clientWidth||600,H=220;
  const others=[res.juros,res.saldo].map(r=>r.never?0:r.months);let len=Math.max(...others,res.min.never?0:res.min.months,1);if(res.min.never)len=Math.max(len,Math.max(...others)*2,24);len=Math.min(len,180);
  const max=niceMax(res.min.serie[0]||0),L=64,B=22,T=8,R=6,pw=W-L-R,ph=H-T-B,x=i=>L+(i/len)*pw,y=v=>T+ph-(Math.min(v,max)/max)*ph;let g='';
  for(let i=0;i<=4;i++){const v=max*i/4;g+=`<line class="gl" x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}"/><text x="${L-7}" y="${y(v)+4}" text-anchor="end">${brlShort(v)}</text>`}
  const step=Math.max(1,Math.ceil(len/6));for(let i=0;i<=len;i+=step)g+=`<text x="${x(i)}" y="${H-6}" text-anchor="${i===0?'start':'middle'}">${mShort(addM(CUR,i))}</text>`;
  const series=[['min','Só o mínimo','var(--g2)'],['saldo','Menor saldo','var(--g1)'],['juros','Maiores juros','var(--s-in)']];
  for(const [k,,c] of series){const pts=res[k].serie.slice(0,len+1);const on=S.strategy===k;g+=`<path d="M${pts.map((v,i)=>`${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('L')}" fill="none" stroke="${c}" stroke-width="${on?2.6:1.6}" opacity="${on?1:.75}" stroke-linejoin="round" stroke-linecap="round"/>`}
  const bw=pw/len;for(let i=0;i<=len;i++){const tip=`${mLong(addM(CUR,i))}\n`+series.map(([k,n])=>`${n}: ${brl(res[k].serie[i]??0)}`).join('\n');g+=`<g class="col"><rect class="hit" style="cursor:default" x="${x(i)-bw/2}" y="${T}" width="${bw}" height="${ph}" data-tip="${esc(tip)}"/><line class="xh" x1="${x(i)}" x2="${x(i)}" y1="${T}" y2="${T+ph}" pointer-events="none"/></g>`}
  el.innerHTML=`<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Saldo devedor projetado por estratégia">${g}</svg>`}
function spark(vals,color='currentColor'){if(vals.every(v=>!v))return '';const W=82,H=30,max=Math.max(...vals),min=Math.min(0,...vals),x=i=>2+i*(W-6)/(vals.length-1),y=v=>H-3-((v-min)/((max-min)||1))*(H-8);
  const p=vals.map((v,i)=>`${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('L');
  return `<svg class="spark" viewBox="0 0 ${W} ${H}" aria-hidden="true"><path d="M${p}L${x(vals.length-1)},${H}L${x(0)},${H}Z" fill="${color}" opacity=".16"/><path d="M${p}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linejoin="round"/><circle cx="${x(vals.length-1)}" cy="${y(vals[vals.length-1])}" r="2.6" fill="${color}"/></svg>`}
const last6=fn=>Array.from({length:6},(_,i)=>fn(sums(addM(S.month,i-5))));
function drawCharts(){$$('[data-chart]').forEach(el=>({flow:drawFlow,groups:drawGroups,plan:drawPlan}[el.dataset.chart](el)))}

/* ---------- páginas ---------- */
const kpi=(lab,cents,sub,extra='',feat=false)=>`<div class="kpi glass land ${feat?'feat':''}"><div class="lab">${lab}</div><div class="val" data-count="${cents}">${brl(cents)}</div><div class="sub">${sub}</div>${extra}</div>`;
const hasData=()=>S.tx.length||S.debts.length||S.cards.length;
const allLoaded=()=>S.loaded.tx&&S.loaded.debts&&S.loaded.cards;
const emptyBox=(t,d,btn='')=>`<div class="empty"><b>${t}</b>${d}${btn?`<br>${btn}`:''}</div>`;
function planFor(){const extra=S.cfg.extraCents||0;const r={min:simulate(S.debts,0,'min'),juros:simulate(S.debts,extra,'juros'),saldo:simulate(S.debts,extra,'saldo')};return r}

function pagePainel(){
  const k=S.month,s=sums(k),h=now.getHours(),hi=h<12?'Bom dia':h<18?'Boa tarde':'Boa noite',at=attention(),late=at.filter(a=>a.date<TODAY).length,soon=urgentes(at).length-late,debt=totalDebt(),fut=parcelasFuturas();
  const comp=s.in?Math.round((s.parc+s.div)/s.in*100):null,poup=s.in?Math.round(s.saldo/s.in*100):null;
  const verb=k<CUR?['entraram','saíram']:k===CUR?['entram','saem']:['devem entrar','devem sair'];
  const story=!allLoaded()?'Carregando seus dados…':!hasData()?'Nada cadastrado ainda. Siga os três passos abaixo para o painel começar a trabalhar.':
    `Em ${MES[+k.slice(5)-1]} ${verb[0]} ${brl(s.in)} e ${verb[1]} ${brl(s.out)}. ${s.saldo>=0?`Sobram ${brl(s.saldo)}`:`Faltam ${brl(-s.saldo)}`}.${comp!=null?` Parcelas e dívidas levam ${comp}% da renda do mês.`:''}`;
  const plan=planFor(),best=plan.juros;
  const steps=[['Renda',S.tx.some(t=>t.tipo==='receita'),'Cadastre o que entra: salário, pró-labore e outras receitas.','Lançar receita','new-rec'],['Dívidas e cartões',S.debts.length>0||S.cards.length>0,'Liste cada dívida com saldo e juros, e os cartões com fechamento e vencimento.','Cadastrar dívida','new-debt'],['Gastos',S.tx.some(t=>t.tipo==='despesa'),'Lance as despesas à vista, parceladas ou recorrentes.','Lançar despesa','new-desp']];
  const showSteps=allLoaded()&&steps.some(x=>!x[1]);
  const cats=Object.entries(s.cat).sort((a,b)=>b[1]-a[1]).slice(0,5);
  return `<div class="head land"><div><h1>${hi}, Davi</h1><p>${story}</p><div class="chips">
    ${late?`<span class="chip bad">${ic('alert')}${late} em atraso</span>`:''}${soon?`<span class="chip warn">${ic('clock')}${soon} em 7 dias</span>`:''}${allLoaded()&&hasData()&&!late&&!soon?`<span class="chip good">${ic('check')}Nada vencendo em 7 dias</span>`:''}
    ${S.debts.length?`<span class="chip">${S.debts.filter(d=>d.saldoCents>0).length} dívidas abertas</span>`:''}${S.cards.length?`<span class="chip">${S.cards.length} cartões</span>`:''}</div></div>
    <div class="acts"><button class="btn" data-act="new-debt">${ic('plus')}Dívida</button><button class="btn pri" data-act="new-tx">${ic('plus')}Lançamento</button></div></div>
  ${showSteps?`<section class="card glass land"><div class="cardhead"><div><h2>Comece por aqui</h2><small>O painel está zerado. Cada passo destrava uma parte dele.</small></div></div><div class="steps">${steps.map((x,i)=>`<div class="step ${x[1]?'done':''}"><span class="stepn">Passo ${i+1}${x[1]?' · feito':''}</span><b>${x[0]}</b><p>${x[2]}</p><button class="btn sm ${x[1]?'':'pri'}" data-act="${x[4]}">${x[3]}</button></div>`).join('')}</div></section>`:''}
  <div class="grid g4">
    ${saldoBox()}
    ${kpi('Entradas',s.in,`${brl(s.inPaid)} já recebidos`,spark(last6(x=>x.in),'var(--s-in)'))}
    ${kpi('Saídas',s.out,`${brl(s.outPaid)} já pagos`,spark(last6(x=>x.out),'var(--s-out)'))}
    ${kpi('Dívidas totais',debt,S.debts.length?`${S.debts.filter(d=>d.saldoCents>0).length} abertas`:'Nenhuma cadastrada')}
  </div>
  <div class="grid g21">
    <section class="card glass land flexc"><div class="cardhead"><div><h2>Entradas e saídas</h2><small>Clique num mês para abrir. Barras claras são previsão.</small></div><div class="legend"><span><i style="background:var(--s-in)"></i>Entradas</span><span><i style="background:var(--s-out)"></i>Saídas</span></div></div>
      <div class="chart" data-chart="flow"></div>
      <div class="ministats">
        <div class="ms"><small>Parcelas a vencer</small><b>${brl(fut)}</b><span>compras parceladas</span></div>
        <div class="ms"><small>Renda comprometida</small><b>${comp==null?'—':comp+'%'}</b><span>parcelas e dívidas</span></div>
        <div class="ms"><small>Taxa de sobra</small><b>${poup==null?'—':poup+'%'}</b><span>saldo sobre entradas</span></div>
        <div class="ms"><small>Meta: zerar dívidas</small><b>${!S.debts.length?'—':best.never?'Sem prazo':prazo(best.months)}</b><span>${debt?(best.never?'o valor mensal não cobre':`até ${mShort(addM(CUR,best.months))}`):'cadastre as dívidas'}</span></div>
      </div></section>
    <section class="card glass land"><div class="cardhead"><div><h2>Precisa de você</h2><small>Atrasos, faturas dos cartões e o que vence em 7 dias</small></div></div>
      ${s.out?`<div class="ms" style="margin-bottom:8px"><small>Pago em ${MES[+k.slice(5)-1]}</small><b>${brl(s.outPaid)} <span>de ${brl(s.out)}</span></b><div class="prog" style="margin-top:6px"><i style="width:${Math.min(100,s.outPaid/s.out*100)}%"></i></div></div>`:''}
      <div>${at.length?[...at.filter(a=>a.kind==='fatura'),...at.filter(a=>a.kind!=='fatura').slice(0,5)].map(attItem).join(''):emptyBox('Tudo em dia','Quando algo vencer ou atrasar, aparece aqui com o botão de pagar.')}</div>
      ${at.filter(a=>a.kind!=='fatura').length>5?`<button class="btn sm" data-go="proximos-meses" style="margin-top:8px">Ver mais ${at.filter(a=>a.kind!=='fatura').length-5}</button>`:''}</section>
  </div>
  ${faturasSection()}
  <div class="grid g2">
    <section class="card glass land"><div class="cardhead"><div><h2>Para onde foi</h2><small>${mLong(k)}</small></div><button class="btn sm" data-go="para-onde-vai">Detalhar</button></div>
      ${s.out?groupStack(s)+`<div style="margin-top:8px">${cats.map(([c,v])=>catBar(c,v,cats[0][1],s.out)).join('')}</div>`:emptyBox('Sem gastos neste mês','Lance a primeira despesa para ver o destino do dinheiro.',`<button class="btn sm pri" data-act="new-desp">Lançar despesa</button>`)}</section>
    <section class="card glass land"><div class="cardhead"><div><h2>Saída das dívidas</h2><small>Ordem pelos maiores juros</small></div><button class="btn sm" data-go="dividas">Abrir plano</button></div>
      ${S.debts.length?debtSummary(best):emptyBox('Nenhuma dívida cadastrada','Cadastre saldo, juros e parcela de cada uma para calcular a ordem e o prazo.',`<button class="btn sm pri" data-act="new-debt">Cadastrar dívida</button>`)}</section>
  </div>`}
function saldoAtual(){const b=S.cfg.saldoBase;if(!b)return null;let v=b.valorCents;const lim=addM(CUR,12);
  for(const t of S.tx){const pe=t.pagosEm||{};for(const o of occsOf(t,lim)){if(!o.paid)continue;const ts=pe[o.key];if(!(ts!=null?ts>=b.ts:o.date>b.data))continue;v+=t.tipo==='receita'?o.cents:-o.cents}}
  return v}
function saldoBox(){const a=saldoAtual(),attrs='role="button" tabindex="0" data-act="set-saldo" style="cursor:pointer"';
  if(a==null)return `<div class="kpi glass land feat" ${attrs}><div class="lab">Saldo atual</div><div class="val" style="font-size:19px">Informar saldo</div><div class="sub">Toque e digite quanto tem hoje nas contas</div></div>`;
  const pend=occs(CUR).filter(o=>!o.paid).reduce((x,o)=>x+(tipoOf(o)==='receita'?o.cents:-o.cents),0);
  return `<div class="kpi glass land feat" ${attrs} title="Toque para ajustar"><div class="lab">Saldo atual</div><div class="val" data-count="${a}">${brl(a)}</div><div class="sub">Fim de ${MES[+CUR.slice(5)-1]}: <span style="white-space:nowrap">${brl(a+pend)}</span> · toque para ajustar</div></div>`}
function saldoForm(){const a=saldoAtual();
  openDialog(mHead('Saldo atual')+`<form class="fm" id="sform" novalidate><div class="fld w"><label for="s_v">Quanto você tem hoje, somando as contas</label><input class="inp" id="s_v" inputmode="decimal" value="${a!=null?moneyInput(a):''}" placeholder="0,00" autocomplete="off"><span class="hint">Some o saldo das contas que você usa. Não conte limite de cheque especial nem de cartão. Se estiver negativo, use o sinal de menos.</span></div><p class="fld w hint">Daqui em diante, o app soma o que você marcar como recebido e desconta o que marcar como pago, inclusive faturas. Compra no crédito só sai do saldo quando a fatura é paga.</p><div class="err" id="s_e" hidden></div></form><div class="mf"><button class="btn" data-act="close">Cancelar</button><button class="btn pri" data-act="saldo-save">Salvar saldo</button></div>`);$('#s_v').focus()}
function faturasSection(){const k=S.month;
  if(!S.cards.length)return allLoaded()?`<section class="card glass land"><div class="cardhead"><div><h2>Faturas dos cartões</h2><small>Cadastre seus cartões para acompanhar cada fatura.</small></div><button class="btn sm pri" data-act="new-card">${ic('plus')}Cartão</button></div></section>`:'';
  const dados=S.cards.map(c=>{const L=occs(k).filter(o=>o.tx?.cartaoId===c.id),tot=L.reduce((a,o)=>a+o.cents,0),pend=L.filter(o=>!o.paid).reduce((a,o)=>a+o.cents,0),venc=L[0]?.date||clampDay(k,c.venc),next=occs(addM(k,1)).filter(o=>o.tx?.cartaoId===c.id).reduce((a,o)=>a+o.cents,0);return{c,tot,pend,venc,next}});
  const total=dados.reduce((a,d)=>a+d.pend,0);
  return `<section class="card glass land"><div class="cardhead"><div><h2>Faturas dos cartões</h2><small>${mLong(k)} · ${brl(total)} em aberto</small></div><button class="btn sm" data-go="cartoes">Ver compras</button></div><div class="grid g3">${dados.map(({c,tot,pend,venc,next})=>{const st=!tot?'<span class="chip sm">Sem compras</span>':!pend?'<span class="chip sm good">Paga</span>':venc<TODAY?'<span class="chip sm bad">Atrasada</span>':'<span class="chip sm warn">Em aberto</span>';
    return `<div class="ms"><div class="legend" style="justify-content:space-between;align-items:center"><b style="font-size:14px">${esc(c.nome)}</b>${st}</div><div class="big" style="font-size:22px;margin:6px 0 2px">${brl(tot)}</div><span>Vence ${dBr(venc)}${c.titular?' · '+esc(c.titular):''}</span><br><span>Próxima: ${brl(next)}</span>${pend?`<button class="btn sm pri" style="display:flex;width:100%;margin-top:8px" data-act="ask-fatura" data-card="${c.id}" data-k="${k}">Pagar ${brl(pend)}</button>`:''}</div>`}).join('')}</div></section>`}
function debtSummary(best){const list=S.debts.filter(d=>d.saldoCents>0).sort((a,b)=>(best.payoff[a.id]||999)-(best.payoff[b.id]||999)||(b.jurosMes||0)-(a.jurosMes||0)).slice(0,5);
  if(!list.length)return emptyBox('Dívidas zeradas','Próxima etapa: reserva de emergência.');
  return list.map((d,i)=>`<div class="item"><span class="tag ${d.situacao==='atrasada'?'bad':''}">${i+1}</span><div class="tx"><b>${esc(d.credor)}</b><small>${d.jurosMes!=null?String(d.jurosMes).replace('.',',')+'% a.m.':'juros não informados'}${best.payoff[d.id]?` · quita em ${mShort(addM(CUR,best.payoff[d.id]))}`:''}</small></div><div class="money">${brl(d.saldoCents)}</div></div>`).join('')}
function attItem(a){if(a.kind==='val'){const t=a.o.tx;return `<div class="item"><span class="tag warn">${ic('clock')}</span><div class="tx"><b>Informar valor: ${esc(t.descricao)}</b><small>${t.tipo==='receita'?'recebe':'vence'} ${dBr(a.o.date)}${a.cents?` · previsão ${brl(a.cents)}`:' · sem previsão'}</small></div><button class="btn sm" data-act="set-val" data-id="${t.id}" data-k="${a.o.key}">Informar</button></div>`}
  const late=a.date<TODAY,when=late?`venceu ${dBr(a.date)}`:a.date===TODAY?'vence hoje':`vence ${dBr(a.date)}`;
  if(a.kind==='fatura')return `<div class="item"><span class="tag ${late?'bad':'warn'}">${ic('cartao')}</span><div class="tx"><b>Fatura ${esc(a.card.nome)} · ${brl(a.cents)}</b><small>Fatura de ${mShort(a.key)} · ${when}</small></div><button class="btn sm" data-act="ask-fatura" data-card="${a.card.id}" data-k="${a.key}">Pagar</button></div>`;
  if(a.kind==='debt'){const d=a.o.debt;return `<div class="item"><span class="tag ${late?'bad':'warn'}">${ic('divida')}</span><div class="tx"><b>${esc(d.credor)} · ${brl(a.cents)}</b><small>Dívida · ${when}</small></div><button class="btn sm" data-act="pay-debt" data-id="${d.id}">Pagar</button></div>`}
  const t=a.o.tx,rec=t.tipo==='receita';return `<div class="item"><span class="tag ${rec?'good':late?'bad':'warn'}">${ic(rec?'up':late?'alert':'clock')}</span><div class="tx"><b>${esc(t.descricao)} · ${brl(a.cents)}</b><small>${rec?(late?'previsto '+dBr(a.date):'previsto '+dBr(a.date)):when}</small></div><button class="btn sm" data-act="mark" data-id="${t.id}" data-k="${a.o.key}">${rec?'Recebi':'Paguei'}</button></div>`}
function groupStack(s){const t=s.out||1;return `<div class="stack" role="img" aria-label="Divisão por grupo">${Object.keys(GRUPOS).filter(g=>s.grp[g]).map(g=>`<i style="width:${s.grp[g]/t*100}%;background:${GRUPOS[g].cor}" data-tip="${esc(GRUPOS[g].nome+': '+brl(s.grp[g]))}"></i>`).join('')}</div><div class="legend" style="margin-top:8px">${Object.keys(GRUPOS).map(g=>`<span><i style="background:${GRUPOS[g].cor}"></i>${GRUPOS[g].nome} ${Math.round(s.grp[g]/t*100)}%</span>`).join('')}</div>`}
const catColor=c=>{for(const g in CAT_D)if(CAT_D[g].includes(c))return GRUPOS[g].cor;const x=(S.cfg.cats||[]).find(i=>i.nome===c);return x?GRUPOS[x.grupo]?.cor||'var(--g2)':'var(--g2)'};
function catBar(c,v,max,total,meta=''){return `<button class="bar" data-act="filter-cat" data-c="${esc(c)}"><span class="nm">${esc(c)}</span><span class="vl">${brl(v)}</span><span class="tr"><i style="width:${v/max*100}%;background:${catColor(c)}"></i></span><span class="mt"><span>${Math.round(v/total*100)}% das saídas</span>${meta}</span></button>`}

function txRow(o){const d=o.debt,t=o.tx,rec=tipoOf(o)==='receita';
  const forma=d?'<span class="chip sm warn">Dívida</span>':t.modo==='parcelado'?`<span class="chip sm">Parcela ${o.n}/${o.N}</span>`:t.modo==='recorrente'?(o.variavel?`<span class="chip sm ${o.informado?'':'warn'}">${o.informado?'Variável':'Estimado'}</span> <button class="btn sm" data-act="set-val" data-id="${t.id}" data-k="${o.key}">${o.informado?'Alterar':'Informar'}</button>`:'<span class="chip sm">Recorrente</span>'):'<span class="chip sm">À vista</span>';
  const card=t?.cartaoId&&S.cards.find(c=>c.id===t.cartaoId);
  const stat=d?`<button class="btn sm" data-act="pay-debt" data-id="${d.id}">Pagar</button>`:card?(o.paid?'<span class="chip sm good">Fatura paga</span>':'<span class="chip sm">Na fatura</span>'):`<label class="tog" data-stop="1"><input type="checkbox" data-act="mark-box" data-id="${t.id}" data-k="${o.key}" ${o.paid?'checked':''}><span>${o.paid?(rec?'Recebido':'Pago'):(rec?'A receber':(o.date<TODAY?'Atrasado':'A pagar'))}</span></label>`;
  return `<div class="row" ${t?`data-act="edit-tx" data-id="${t.id}" role="button" tabindex="0"`:''} style="${t?'cursor:pointer':''}"><span class="dt">${dBr(o.date)}</span><div class="ds"><b>${esc(d?d.credor:t.descricao)}${t?.anexos?.length?` <button class="chip sm" style="vertical-align:1px" data-act="ver-anexo" data-id="${t.id}" aria-label="Ver nota fiscal">${ic('clip').replace('class="ic"','class="ic" style="width:12px;height:12px"')}${t.anexos.length>1?t.anexos.length:'Nota'}</button>`:''}</b><small>${esc(d?'Parcela da dívida':(t.categoria||''))}${card?' · '+esc(card.nome):t?.meio&&MEIOS[t.meio]?' · '+MEIOS[t.meio]:''}</small></div><div class="ct">${forma}</div><div class="money ${rec?'in':''}">${o.variavel&&!o.informado?'≈ ':''}${rec?'+':''}${brl(o.cents)}</div><div class="end">${stat}</div></div>`}
function txListHtml(){let L=occs(S.month).slice().sort((a,b)=>a.date.localeCompare(b.date));
  if(S.fTipo!=='todos')L=L.filter(o=>tipoOf(o)===S.fTipo);
  if(S.fCat)L=L.filter(o=>(o.debt?'Pagamento de dívida':o.tx.categoria)===S.fCat);
  if(S.fStatus==='abertos')L=L.filter(o=>!o.paid);if(S.fStatus==='pagos')L=L.filter(o=>o.paid);
  if(S.fText){const q=S.fText.toLowerCase();L=L.filter(o=>(o.debt?o.debt.credor:(o.tx.descricao+' '+o.tx.categoria)).toLowerCase().includes(q))}
  if(!L.length)return emptyBox(occs(S.month).length?'Nada com esses filtros':'Nenhum lançamento neste mês',occs(S.month).length?'Limpe os filtros para ver tudo.':'Registre uma receita ou despesa à vista, parcelada ou recorrente.',occs(S.month).length?'':`<button class="btn sm pri" data-act="new-tx">Novo lançamento</button>`);
  const ent=L.filter(o=>tipoOf(o)==='receita').reduce((a,o)=>a+o.cents,0),sai=L.filter(o=>tipoOf(o)!=='receita').reduce((a,o)=>a+o.cents,0);
  return `<div class="row hd"><span>Vence</span><span>Descrição</span><span>Forma</span><span class="money" style="font-weight:400">Valor</span><span style="text-align:right">Situação</span></div><div class="rows">${L.map(txRow).join('')}</div><div class="legend" style="justify-content:flex-end;padding:11px 8px 0"><span>Entradas <b>${brl(ent)}</b></span><span>Saídas <b>${brl(sai)}</b></span><span>${L.length} itens</span></div>`}
function pageLanc(){const s=sums(S.month),cats=[...new Set(occs(S.month).map(o=>o.debt?'Pagamento de dívida':o.tx.categoria))].sort();
  return `<div class="head land"><div><h1>Lançamentos</h1><p>${mLong(S.month)}: parcelas e recorrências entram sozinhas em cada mês.</p></div><div class="acts"><button class="btn" data-act="new-rec">${ic('plus')}Receita</button><button class="btn pri" data-act="new-desp">${ic('plus')}Despesa</button></div></div>
  <div class="grid g3">${kpi('Entradas',s.in,`${brl(s.inPaid)} recebidos`)}${kpi('Saídas',s.out,`${brl(s.outPaid)} pagos`)}${kpi('Saldo',s.saldo,s.saldo>=0?'Sobra':'Falta')}</div>
  <section class="card glass land"><div class="filters"><div class="seg" role="group" aria-label="Tipo">${[['todos','Todos'],['despesa','Despesas'],['receita','Receitas']].map(([v,n])=>`<button class="${S.fTipo===v?'on':''}" data-act="f-tipo" data-v="${v}">${n}</button>`).join('')}</div>
    <select class="sel" id="f-cat" aria-label="Categoria"><option value="">Todas as categorias</option>${cats.map(c=>`<option ${S.fCat===c?'selected':''}>${esc(c)}</option>`).join('')}</select>
    <select class="sel" id="f-status" aria-label="Situação"><option value="">Toda situação</option><option value="abertos" ${S.fStatus==='abertos'?'selected':''}>Em aberto</option><option value="pagos" ${S.fStatus==='pagos'?'selected':''}>Pagos e recebidos</option></select>
    <input class="inp" id="f-text" placeholder="Buscar descrição" value="${esc(S.fText)}" aria-label="Buscar"></div>
    <div class="scroll"><div id="txlist">${txListHtml()}</div></div></section>`}
function pageOnde(){const k=S.month,s=sums(k),cats=Object.entries(s.cat).sort((a,b)=>b[1]-a[1]);
  const avg=c=>{const v=[1,2,3].map(i=>sums(addM(k,-i)).cat[c]||0);const n=v.filter(Boolean).length;return n?v.reduce((a,b)=>a+b,0)/n:null};
  const tops=occs(k).filter(o=>tipoOf(o)!=='receita').sort((a,b)=>b.cents-a.cents).slice(0,6);
  const finP=s.in?Math.round(s.grp.fin/s.in*100):null;
  const cortar=s.grp.nao+s.grp.fin;
  return `<div class="head land"><div><h1>Para onde vai</h1><p>Valores pelo mês em que a parcela ou fatura vence, que é quando o dinheiro sai de fato.</p></div></div>
  <div class="grid g4">${kpi('Essenciais',s.grp.essencial,s.out?`${Math.round(s.grp.essencial/s.out*100)}% das saídas`:'—')}${kpi('Não essenciais',s.grp.nao,s.out?`${Math.round(s.grp.nao/s.out*100)}% das saídas`:'—')}${kpi('Financeiras',s.grp.fin,finP!=null?`${finP}% da renda`:'juros, tarifas, dívidas')}${kpi('Onde dá para mexer',cortar,'Não essenciais + financeiras')}</div>
  <div class="grid g21">
    <section class="card glass land"><div class="cardhead"><div><h2>Por categoria</h2><small>${mLong(k)}. Clique para ver os lançamentos.</small></div></div>
      ${s.out?groupStack(s)+`<div style="margin-top:8px">${cats.map(([c,v])=>{const a=avg(c);let m='';if(a){const p=Math.round((v-a)/a*100);m=`<span>${p>=0?'+':''}${p}% sobre a média de 3 meses</span>`}return catBar(c,v,cats[0][1],s.out,m)}).join('')}</div>`:emptyBox('Sem despesas neste mês','Lance despesas para ver o ranking.',`<button class="btn sm pri" data-act="new-desp">Lançar despesa</button>`)}</section>
    <div class="grid" style="align-content:start">
      <section class="card glass land"><div class="cardhead"><h2>Maiores saídas</h2></div>${tops.length?tops.map(o=>`<div class="item"><div class="tx"><b>${esc(o.debt?o.debt.credor:o.tx.descricao)}</b><small>${esc(o.debt?'Dívida':o.tx.categoria)}${o.n?` · ${o.n}/${o.N}`:''}</small></div><div class="money">${brl(o.cents)}</div></div>`).join(''):'<p class="sub">Nada ainda.</p>'}</section>
    </div>
  </div>
  <section class="card glass land"><div class="cardhead"><div><h2>Evolução dos gastos</h2><small>Até ${mLong(k)}</small></div><div class="legend">${Object.values(GRUPOS).map(g=>`<span><i style="background:${g.cor}"></i>${g.nome}</span>`).join('')}</div></div><div class="chart" data-chart="groups" style="min-height:220px"></div></section>`}
function phaseOf(){const s=sums(CUR),lateN=attention().filter(a=>a.date<TODAY).length;
  if(!S.debts.length)return{i:0,why:'Cadastre todas as dívidas para calcular a ordem e o prazo.'};
  if(totalDebt()===0)return{i:3,why:'Saldo zerado. Próxima etapa: reserva de emergência.'};
  if(s.saldo<0||lateN)return{i:0,why:s.saldo<0?`O mês atual fecha em ${brl(s.saldo)}. Primeiro é preciso parar de aumentar a dívida.`:`Há ${lateN} ${lateN>1?'contas':'conta'} em atraso. Regularize antes de acelerar.`};
  if(!(S.cfg.extraCents>0))return{i:1,why:`O mês atual sobra ${brl(s.saldo)}. Defina abaixo quanto vai para as dívidas além da parcela.`};
  return{i:2,why:`${brl(S.cfg.extraCents)} por mês acima das parcelas. Mantenha enquanto o saldo do mês permitir.`}}
function pageDividas(){const open=S.debts.filter(d=>d.saldoCents>0),debt=totalDebt(),minM=open.reduce((a,d)=>a+(d.parcelaCents||0),0),juros=open.reduce((a,d)=>a+d.saldoCents*(d.jurosMes||0)/100,0),pago=S.debts.flatMap(d=>d.pagamentos||[]).reduce((a,p)=>a+p.valorCents,0);
  const ph=phaseOf(),names=['Estabilização','Controle','Ataque','Quitação'],desc=['Parar de aumentar','Sobra todo mês','Valor extra na dívida','Dívida zero'];
  const sorted=[...S.debts].sort((a,b)=>(b.saldoCents>0)-(a.saldoCents>0)||(b.jurosMes??-1)-(a.jurosMes??-1));
  const s=sums(CUR);
  return `<div class="head land"><div><h1>Dívidas</h1><p>${esc(ph.why)}</p></div><div class="acts"><button class="btn pri" data-act="new-debt">${ic('plus')}Dívida</button></div></div>
  <div class="phase land">${names.map((n,i)=>`<div class="ph ${i===ph.i?'on':i<ph.i?'ok':''}"><b>${i+1}. ${n}</b>${desc[i]}</div>`).join('')}</div>
  <div class="grid g4">${kpi('Saldo devedor',debt,`${open.length} abertas`)}${kpi('Parcelas por mês',minM,s.in?`${Math.round(minM/s.in*100)}% da renda do mês`:'mínimo a pagar')}${kpi('Juros por mês',Math.round(juros),open.some(d=>d.jurosMes==null)?'há dívida sem taxa informada':'estimativa sobre o saldo atual')}${kpi('Já pago',pago,'pagamentos registrados aqui')}</div>
  <section class="card glass land"><div class="cardhead"><div><h2>Inventário</h2><small>Saldo é o valor que você informou. Atualize quando o banco mudar.</small></div></div>
   ${S.debts.length?sorted.map(d=>{const prog=d.saldoInicial?Math.round((1-d.saldoCents/d.saldoInicial)*100):0;const st=d.saldoCents<=0?'<span class="chip sm good">Quitada</span>':d.situacao==='atrasada'?'<span class="chip sm bad">Atrasada</span>':d.situacao==='negociando'?'<span class="chip sm warn">Negociando</span>':'<span class="chip sm">Em dia</span>';
     return `<div class="debt"><div><b class="t">${esc(d.credor)}</b><small>${esc(d.tipo||'')}${d.titular?' · '+esc(d.titular):''}</small><div class="chips" style="margin-top:5px">${st}${d.negativada?'<span class="chip sm bad">Negativada</span>':''}</div></div><div><small>Saldo</small><span class="n">${brl(d.saldoCents)}</span>${d.saldoInicial&&prog>0?`<div class="prog" style="margin-top:5px"><i style="width:${prog}%"></i></div>`:''}</div><div><small>Juros</small><span class="n">${d.jurosMes!=null?String(d.jurosMes).replace('.',',')+'% a.m.':'Não informado'}</span></div><div><small>Parcela</small><span class="n">${d.parcelaCents?brl(d.parcelaCents):'—'}</span><small>${d.parcelasRestantes!=null?d.parcelasRestantes+' restantes':''}${d.venc?' · dia '+d.venc:''}</small></div><div class="acts"><button class="btn sm" data-act="edit-debt" data-id="${d.id}">Editar</button>${d.saldoCents>0?`<button class="btn sm pri" data-act="pay-debt" data-id="${d.id}">Pagar</button>`:''}</div></div>`}).join(''):emptyBox('Nenhuma dívida cadastrada','Comece pela maior ou pela mais atrasada. Fatura de cartão vencida também entra aqui.',`<button class="btn sm pri" data-act="new-debt">Cadastrar dívida</button>`)}</section>
  ${open.length?`<section class="card glass land"><div class="cardhead"><div><h2>Plano de quitação</h2><small>Paga a parcela de todas e joga o resto em uma dívida por vez. Quando uma acaba, a parcela dela passa para a próxima.</small></div></div>
    <div class="fld" style="margin-bottom:12px"><label for="extra">Extra por mês além das parcelas: <b id="extra-v">${brl(S.cfg.extraCents||0)}</b></label>
      <input type="range" id="extra" min="0" max="${Math.max(500000,S.cfg.extraCents||0)}" step="5000" value="${S.cfg.extraCents||0}">
      <span class="hint">Referência: o saldo do mês atual ${s.saldo>=0?`sobra ${brl(s.saldo)}`:`falta ${brl(-s.saldo)}`}. Não coloque aqui mais do que sobra de verdade.</span></div>
    <div id="plan"></div></section>`:''}`}
function renderPlan(){const box=$('#plan');if(!box)return;const r=planFor();S.planSim=r;
  const pick=S.strategy||(S.strategy='juros'),sel=r[pick];
  const nome={juros:'Maiores juros',saldo:'Menor saldo',min:'Só o mínimo'},noRate=S.debts.filter(d=>d.saldoCents>0&&d.jurosMes==null),noMin=S.debts.filter(d=>d.saldoCents>0&&!d.parcelaCents);
  const card=k=>{const x=r[k];return `<button class="strat ${pick===k?'on':''}" data-act="strat" data-v="${k}"><small>${nome[k]}</small><b>${x.never?'Não quita':prazo(x.months)}</b><small>${x.never?'o valor não vence os juros':`${brl(Math.round(x.juros))} em juros · fim ${mShort(addM(CUR,x.months))}`}</small></button>`};
  const eco=(!r.min.never&&!r.juros.never)?r.min.juros-r.juros.juros:null;
  const rec=r.juros.never?`Com esse valor a dívida não acaba: os juros consomem o pagamento. Aumente o extra ou negocie as taxas.`:r.min.never?`Só com o mínimo a dívida não acaba. Com ${brl(S.cfg.extraCents||0)} de extra, ela termina em ${prazo(r.juros.months)}.`:eco>0?`Atacar os maiores juros economiza ${brl(Math.round(eco))} e ${r.min.months-r.juros.months} meses em relação a pagar só o mínimo.`:'';
  const dif=(!r.juros.never&&!r.saldo.never)?r.saldo.juros-r.juros.juros:0;
  const order=Object.entries(sel.payoff).sort((a,b)=>a[1]-b[1]);
  box.innerHTML=`<div class="grid g3">${card('juros')}${card('saldo')}${card('min')}</div>
   ${rec?`<p style="margin:12px 0 2px"><b>${rec}</b>${dif>100?` Menor saldo custa ${brl(Math.round(dif))} a mais em juros, mas dá vitórias mais cedo.`:''}</p>`:''}
   ${noRate.length?`<p class="banner" style="margin-top:10px">Sem taxa informada: ${noRate.map(d=>esc(d.credor)).join(', ')}. A conta trata como juros zero, então o prazo real é maior.</p>`:''}
   ${noMin.length?`<p class="banner" style="margin-top:10px">Sem parcela informada: ${noMin.map(d=>esc(d.credor)).join(', ')}. Só recebe dinheiro quando sobrar o extra.</p>`:''}
   <div class="cardhead" style="margin:16px 0 6px"><h2>Saldo projetado</h2><div class="legend"><span><i style="background:var(--s-in)"></i>Maiores juros</span><span><i style="background:var(--g1)"></i>Menor saldo</span><span><i style="background:var(--g2)"></i>Só o mínimo</span></div></div>
   <div class="chart" data-chart="plan" style="min-height:220px"></div>
   ${order.length?`<h2 style="margin:14px 0 4px">Ordem de quitação (${nome[pick].toLowerCase()})</h2><div class="chips">${order.map(([id,m],i)=>`<span class="chip">${i+1}. ${esc(S.debts.find(d=>d.id===id)?.credor)} · ${mShort(addM(CUR,m))}</span>`).join('')}</div>`:''}
   <h2 style="margin:16px 0 4px">Mês a mês</h2><div class="scroll"><table><thead><tr><th>Mês</th><th>Quanto em cada dívida</th><th class="num">Total</th><th class="num">Saldo depois</th></tr></thead><tbody>${sel.plano.slice(0,S.planMonths||12).map(p=>`<tr><td style="white-space:nowrap">${mShort(addM(CUR,p.m-1))}</td><td>${Object.entries(p.pays).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]).map(([id,v])=>`${esc(p.nomes[id])} ${brl(Math.round(v))}`).join(' · ')}</td><td class="num">${brl(Math.round(p.total))}</td><td class="num">${brl(Math.round(p.saldo))}</td></tr>`).join('')}</tbody></table></div>
   ${sel.plano.length>(S.planMonths||12)?`<button class="btn sm" data-act="plan-more" style="margin-top:9px">Ver todos os ${sel.plano.length} meses</button>`:''}`;
  $$('[data-chart="plan"]').forEach(drawPlan)}
function pageCartoes(){const k=S.month;
  return `<div class="head land"><div><h1>Cartões</h1><p>Compras no cartão entram na fatura certa pelo dia de fechamento. Fatura antiga em atraso vai em Dívidas, para contar os juros.</p></div><div class="acts"><button class="btn pri" data-act="new-card">${ic('plus')}Cartão</button></div></div>
  ${S.cards.length?`<div class="grid g3">${S.cards.map(c=>{const list=occs(k).filter(o=>o.tx?.cartaoId===c.id),fat=list.reduce((a,o)=>a+o.cents,0),pend=list.filter(o=>!o.paid).reduce((a,o)=>a+o.cents,0);
    let usado=0;for(const t of S.tx){if(t.cartaoId!==c.id)continue;for(const o of occsOf(t,addM(CUR,12)))if(!o.paid&&(t.modo!=='recorrente'||o.key<=addM(CUR,1)))usado+=o.cents}
    const pct=c.limiteCents?Math.round(usado/c.limiteCents*100):0,prox=[1,2,3].map(i=>{const m=addM(k,i);return [m,occs(m).filter(o=>o.tx?.cartaoId===c.id).reduce((a,o)=>a+o.cents,0)]});
    return `<article class="ccard land"><div class="cardhead" style="margin:0"><div><h2>${esc(c.nome)}</h2><small>${esc(c.titular||'')}${c.titular?' · ':''}fecha dia ${c.fecha}, vence dia ${c.venc}</small></div><button class="btn sm" data-act="edit-card" data-id="${c.id}">Editar</button></div>
      <div><small class="sub">Fatura de ${mShort(k)}</small><div class="big" style="font-size:27px">${brl(fat)}</div><small class="sub">${fat?(pend?`${brl(pend)} em aberto`:'Paga'):'Sem compras nesta fatura'}</small></div>
      ${c.limiteCents?`<div><div class="legend" style="justify-content:space-between;margin-bottom:5px"><span>Limite comprometido</span><span>${pct}% de ${brl(c.limiteCents)}</span></div><div class="prog"><i style="width:${Math.min(100,pct)}%;background:${pct>=80?'var(--bad)':pct>=50?'var(--warn)':'var(--good)'}"></i></div></div>`:''}
      <div class="legend" style="justify-content:space-between">${prox.map(([m,v])=>`<span>${mShort(m)}<br><b style="color:var(--fg)">${brl(v)}</b></span>`).join('')}</div>
      ${pend?`<button class="btn sm pri" data-act="ask-fatura" data-card="${c.id}" data-k="${k}">Marcar fatura como paga</button>`:''}
    </article>`}).join('')}</div>
    <section class="card glass land"><div class="cardhead"><div><h2>Compras nas faturas de ${mShort(k)}</h2></div></div>${(()=>{const L=occs(k).filter(o=>o.tx?.cartaoId).sort((a,b)=>b.cents-a.cents);return L.length?`<div class="rows">${L.map(txRow).join('')}</div>`:emptyBox('Nenhuma compra neste mês','Lance uma despesa e escolha o cartão como forma de pagamento.',`<button class="btn sm pri" data-act="new-desp">Lançar despesa</button>`)})()}</section>`
  :`<section class="card glass land">${emptyBox('Nenhum cartão cadastrado','Cadastre nome, titular, limite, fechamento e vencimento de cada cartão.',`<button class="btn sm pri" data-act="new-card">Cadastrar cartão</button>`)}</section>`}`}
function pageProx(){const k=S.month,[y,m]=k.split('-').map(Number),firstDow=new Date(y,m-1,1).getDay(),n=dim(k),by={};
  occs(k).forEach(o=>{(by[o.date]=by[o.date]||[]).push(o)});
  let cells='';for(let i=0;i<firstDow;i++)cells+='<div class="day off"></div>';
  for(let d=1;d<=n;d++){const iso=`${k}-${pad(d)}`,L=by[iso]||[],o=L.filter(x=>tipoOf(x)!=='receita').reduce((a,x)=>a+x.cents,0),i=L.filter(x=>tipoOf(x)==='receita').reduce((a,x)=>a+x.cents,0);
    cells+=`<button class="day ${iso===TODAY?'today':''} ${iso===S.day?'sel':''}" data-act="day" data-d="${iso}" ${L.length?`data-tip="${esc(L.map(x=>`${x.debt?x.debt.credor:x.tx.descricao}: ${brl(x.cents)}`).join('\n'))}"`:''} aria-label="Dia ${d}"><b>${d}</b>${i?`<span class="i">+${compact(i)}</span>`:''}${o?`<span class="o">−${compact(o)}</span>`:''}</button>`}
  const dayList=S.day&&S.day.startsWith(k)?(by[S.day]||[]):[];
  const rows=Array.from({length:12},(_,i)=>{const mk=addM(CUR,i);return{mk,...sums(mk)}});let acc=0;
  const ends=[];for(const t of S.tx){if(t.tipo!=='despesa'||t.modo!=='parcelado')continue;const l=occsOf(t,'9999-12');if(!l.length)continue;const u=l[l.length-1];if(u.key>=CUR)ends.push({t,key:u.key,c:u.cents})}ends.sort((a,b)=>a.key.localeCompare(b.key));
  return `<div class="head land"><div><h1>Próximos meses</h1><p>Previsão com o que já está cadastrado. Gastos que você ainda vai fazer não entram.</p></div></div>
  <section class="card glass land"><div class="cardhead"><div><h2>12 meses</h2><small>Clique para abrir o mês. O acumulado parte de zero em ${mShort(CUR)} e não inclui saldo em conta.</small></div></div><div class="scroll"><table><thead><tr><th>Mês</th><th class="num">Entradas</th><th class="num">Fixos</th><th class="num">Parcelas</th><th class="num">Dívidas</th><th class="num">À vista</th><th class="num">Saldo</th><th class="num">Acumulado</th></tr></thead><tbody>${rows.map(r=>{acc+=r.saldo;return `<tr data-act="month" data-k="${r.mk}" style="cursor:pointer${r.mk===k?';background:var(--glass-3)':''}"><td style="white-space:nowrap;font-weight:600">${mShort(r.mk)}</td><td class="num">${brl(r.in)}</td><td class="num">${brl(r.rec)}</td><td class="num">${brl(r.parc)}</td><td class="num">${brl(r.div)}</td><td class="num">${brl(r.avista)}</td><td class="num" style="font-weight:600;color:${r.saldo<0?'var(--bad)':'var(--fg)'}">${brl(r.saldo)}</td><td class="num" style="color:${acc<0?'var(--bad)':'var(--fg2)'}">${brl(acc)}</td></tr>`}).join('')}</tbody></table></div></section>
  <div class="grid g21"><section class="card glass land"><div class="cardhead"><div><h2>${mLong(k)[0].toUpperCase()+mLong(k).slice(1)}</h2><small>Clique num dia para ver o que vence.</small></div></div><div class="cal">${['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map(d=>`<div class="dow">${d}</div>`).join('')}${cells}</div>
    ${S.day?`<div style="margin-top:12px"><h2 style="margin-bottom:4px">Dia ${dBr(S.day)}</h2>${dayList.length?`<div class="rows">${dayList.map(txRow).join('')}</div>`:'<p class="sub">Nada neste dia.</p>'}</div>`:''}</section>
    <section class="card glass land"><div class="cardhead"><div><h2>Parcelas que terminam</h2><small>Dinheiro que volta para o orçamento</small></div></div>${ends.length?ends.slice(0,8).map(e=>`<div class="item"><span class="tag good">${ic('check')}</span><div class="tx"><b>${esc(e.t.descricao)}</b><small>última em ${mShort(e.key)}</small></div><div class="money">${brl(e.c)}</div></div>`).join(''):emptyBox('Nenhuma parcela ainda','Compras parceladas aparecem aqui com o mês em que acabam.')}</section></div>`}

/* ---------- moldura e renderização ---------- */
function renderSide(){const debt=totalDebt(),acc=ls.get('fd_accent','menta'),at=attention().filter(a=>a.date<TODAY).length;
  const nav=(id,n,i,b='')=>`<button class="nav ${S.page===id?'on':''}" data-go="${id}" title="${n}">${ic(i)}<span>${n}</span>${b}</button>`;
  $('#side').innerHTML=`<div class="brand"><span class="mark"><svg width="26" height="26" viewBox="150 150 724 724" aria-hidden="true"><path d="M270 226H500A286 286 0 0 1 500 798H270Z" fill="none" stroke="currentColor" stroke-width="84" stroke-linejoin="round"/><g fill="currentColor"><rect x="350" y="330" width="76" height="350" rx="20"/><rect x="456" y="470" width="76" height="210" rx="20"/><rect x="562" y="590" width="76" height="90" rx="20"/></g></svg></span><div><b>Finanças do Davi</b><small>Sair das dívidas</small></div><button class="collapse" data-act="rail" aria-label="Recolher menu">${ic('panel')}</button></div>
   <div class="navlabel">Visão</div>${nav('painel','Painel','painel',at?`<span class="badge">${at}</span>`:'')}${nav('lancamentos','Lançamentos','lista')}${nav('para-onde-vai','Para onde vai','pizza')}
   <div class="navlabel">Plano</div>${nav('dividas','Dívidas','divida')}${nav('cartoes','Cartões','cartao')}${nav('proximos-meses','Próximos meses','cal')}
   <div class="grow"></div>
   <div class="mini"><small>Dívidas totais</small><b>${brl(debt)}</b><small>${S.debts.length?`${S.debts.filter(d=>d.saldoCents>0).length} abertas`:'Nada cadastrado'}</small></div>
   <div class="sidefoot"><div class="swatches" role="group" aria-label="Cor de destaque">${[['menta','#3fc9a0'],['floresta','#17603f'],['oceano','#3f78e0'],['ameixa','#7f5fc4'],['brasa','#e0512f']].map(([n,c])=>`<button class="sw ${acc===n?'on':''}" style="background:${c}" data-act="accent" data-v="${n}" aria-label="${n}" title="${n}"></button>`).join('')}</div>
   <button class="nav" data-act="look" title="Claro ou escuro">${ic('moon')}<span>Claro / escuro</span></button><button class="nav" data-act2="backup" title="Baixar backup">${ic('down')}<span>Baixar backup</span></button><button class="nav" data-act2="sair" title="Sair">${ic('out')}<span>Sair</span></button><small style="color:var(--fg3);font-size:11px;padding:4px 11px">Versão ${APP_VER}</small></div>`;
  $('#bottom').innerHTML=PAGES.map(([id,n,i])=>`<button class="${S.page===id?'on':''}" data-go="${id}">${ic(i)}${n.split(' ').slice(-1)[0]==='vai'?'Gastos':n.split(' ')[0]}</button>`).join('')}
function topbar(){const at=urgentes(attention()).length,dn=new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'});
  const nome=PAGES.find(p=>p[0]===S.page)?.[1];
  return `<div class="top glass"><div class="crumb"><b>${nome}</b> · ${dn}</div>
   <div class="monthsw"><button class="iconbtn" data-act="prev" aria-label="Mês anterior">${ic('left')}</button><b>${mLong(S.month).replace(' de ',' ')}</b><button class="iconbtn" data-act="next" aria-label="Próximo mês">${ic('right')}</button></div>
   ${S.month!==CUR?`<button class="btn sm" data-act="today">Hoje</button>`:''}
   <button class="bell" data-go="painel" aria-label="${at} pendências">${ic('bell')}${at?`<span class="badge">${at}</span>`:''}</button>
   <button class="btn pri newbtn" data-act="new-tx">${ic('plus')}Novo</button><div class="avatar" aria-hidden="true">DG</div><button class="iconbtn mobout" data-act="look" aria-label="Claro ou escuro">${ic('moon')}</button><button class="iconbtn mobout" data-act2="backup" aria-label="Baixar backup">${ic('down')}</button><button class="iconbtn mobout" data-act2="sair" aria-label="Sair">${ic('out')}</button><small class="mobout" style="color:var(--fg3);font-size:11px;align-self:center">v${APP_VER}</small></div>
   
   ${S.unreach?`<div class="banner">${S.dbErr==='permission-denied'?'Sua conta não tem permissão para abrir estes dados.':'Ainda não consegui carregar seus dados.'} <small>(${esc(S.dbErr||'sem resposta do banco')})</small> <button class="btn sm" data-act2="retry">Tentar de novo</button></div>`:''}`}
function render(animate=false){const act=document.activeElement,fid=act&&act.id&&main.contains(act)?act.id:null,caret=fid&&act.selectionStart;
  const y=window.scrollY;
  const page={painel:pagePainel,lancamentos:pageLanc,'para-onde-vai':pageOnde,dividas:pageDividas,cartoes:pageCartoes,'proximos-meses':pageProx}[S.page]||pagePainel;
  renderSide();main.innerHTML=topbar()+page();
  renderPlan();drawCharts();
  if(fid){const el=document.getElementById(fid);if(el){el.focus();try{el.setSelectionRange(caret,caret)}catch{}}}
  if(animate){window.scrollTo(0,0);land()}else window.scrollTo(0,y)}
const motionOK=()=>!matchMedia('(prefers-reduced-motion: reduce)').matches;
function land(){if(!motionOK()||!Element.prototype.animate)return;
  $$('.land',main).forEach((el,i)=>el.animate([{opacity:0,transform:'translateY(22px) scale(.985)'},{opacity:1,transform:'none'}],{duration:760,delay:i*55,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'}));
  $$('[data-count]',main).forEach(el=>{const to=+el.dataset.count;if(!to)return;const t0=performance.now(),D=850;(function f(t){const p=Math.min(1,(t-t0)/D),e=1-Math.pow(1-p,4);el.textContent=brl(Math.round(to*e));if(p<1)requestAnimationFrame(f)})(t0)})}
const main=$('#main');
function go(p){S.page=p;S.day=null;if(location.hash.slice(1)!==p)location.hash=p;render(true)}
function setMonth(k){S.month=k;S.day=null;dirty();S.fCat='';render(false);main.querySelectorAll('.kpi').forEach(el=>motionOK()&&el.animate?.([{opacity:.45},{opacity:1}],{duration:320}))}
let toastT;function toast(m){const t=$('#toast');t.textContent=m;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>t.hidden=true,2600)}
function refresh(){dirty();render(false)}

/* ---------- modais ---------- */
function openDialog(html){const old=$('#modal dialog');if(old){old.close();old.remove()}const d=document.createElement('dialog');d.innerHTML=html;$('#modal').appendChild(d);d.addEventListener('cancel',()=>setTimeout(closeDialog));d.addEventListener('click',e=>{if(e.target===d)closeDialog()});d.showModal();return d}
function closeDialog(){const d=$('#modal dialog');if(d){d.close();d.remove()}F=null}
const mHead=t=>`<div class="mh"><h2>${t}</h2><button class="iconbtn" data-act="close" aria-label="Fechar">${ic('x')}</button></div>`;
const seg=(field,opts,val,tone)=>`<div class="seg full ${tone?'tone':''}" role="group">${opts.map(([v,n])=>`<button type="button" class="${val===v?'on':''}" data-seg="${field}" data-v="${v}">${n}</button>`).join('')}</div>`;
let F=null;
function catOptions(tipo,val){if(tipo==='receita'){const extra=(S.cfg.cats||[]).filter(c=>c.grupo==='receita').map(c=>c.nome);return [...new Set([...CAT_R,...extra])].map(c=>`<option ${c===val?'selected':''}>${esc(c)}</option>`).join('')+`<option value="__nova" ${val==='__nova'?'selected':''}>+ Nova categoria…</option>`}
  return Object.keys(GRUPOS).map(g=>{const ex=(S.cfg.cats||[]).filter(c=>c.grupo===g).map(c=>c.nome);return `<optgroup label="${GRUPOS[g].nome}">${[...CAT_D[g],...ex].map(c=>`<option ${c===val?'selected':''}>${esc(c)}</option>`).join('')}</optgroup>`}).join('')+`<option value="__nova" ${val==='__nova'?'selected':''}>+ Nova categoria…</option>`}
const MAX_ANEXOS=5,MAX_DATA=950000;
function comprimirFoto(file){return new Promise((ok,no)=>{const u=URL.createObjectURL(file),im=new Image();
  im.onerror=()=>{URL.revokeObjectURL(u);no(new Error('leitura'))};
  im.onload=()=>{URL.revokeObjectURL(u);const w0=im.naturalWidth,h0=im.naturalHeight;
    for(const lado of [1800,1500,1200,1000,800])for(const q of [.72,.6,.5]){const r=Math.min(1,lado/Math.max(w0,h0)),c=document.createElement('canvas');c.width=Math.round(w0*r);c.height=Math.round(h0*r);const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);const d=c.toDataURL('image/jpeg',q);if(d.length<=MAX_DATA)return ok({dataUrl:d,w:c.width,h:c.height})}
    no(new Error('tamanho'))};im.src=u})}
function anexosForm(){const ex=(F.anexos||[]).filter(a=>!(F.anexosRemovidos||[]).includes(a.id)),nv=F.novosAnexos||[],tot=ex.length+nv.length;
  const vh='style="position:absolute;width:1px;height:1px;opacity:0;overflow:hidden"';
  return `<div class="fld w"><span class="lb">Nota fiscal ou comprovante (opcional)</span>
   ${tot<MAX_ANEXOS?`<div class="acts"><label class="btn sm" style="position:relative;cursor:pointer">Tirar foto<input ${vh} type="file" accept="image/*" capture="environment" data-anexo="1" aria-label="Tirar foto"></label><label class="btn sm" style="position:relative;cursor:pointer">Da galeria<input ${vh} type="file" accept="image/*" multiple data-anexo="1" aria-label="Escolher da galeria"></label></div>`:`<span class="hint">Limite de ${MAX_ANEXOS} fotos por lançamento.</span>`}
   ${F.anexando?'<span class="hint">Preparando a foto…</span>':''}
   ${tot?`<div class="acts" style="margin-top:6px">${ex.map((a,i)=>`<span class="chip">${ic('clip')}Foto ${i+1} salva<button type="button" aria-label="Remover foto salva" data-act="anexo-rm" data-id2="${a.id}" style="margin-left:4px">${ic('x')}</button></span>`).join('')}${nv.map(a=>`<span style="position:relative;display:inline-block"><img src="${a.dataUrl}" alt="Foto anexada" style="width:64px;height:64px;object-fit:cover;border-radius:10px;border:1px solid var(--line);display:block"><button type="button" aria-label="Remover foto" data-act="anexo-rm" data-id2="${a.id}" style="position:absolute;top:-6px;right:-6px;width:24px;height:24px;border-radius:50%;background:var(--modal);border:1px solid var(--line);display:grid;place-items:center">${ic('x')}</button></span>`).join('')}</div>`:''}</div>`}
function verAnexo(aid,n,tot){openDialog(mHead(tot>1?`Foto ${n} de ${tot}`:'Nota fiscal')+`<div id="ax" style="padding:13px 19px 19px;min-height:120px"><p class="hint">Abrindo a foto…</p></div>`);
  store.getAnexo(aid).then(d=>{const b=$('#ax');if(!b)return;b.innerHTML=d?.dataUrl?`<img src="${d.dataUrl}" alt="Nota fiscal anexada" style="width:100%;border-radius:12px;display:block"><p class="hint" style="margin-top:8px">No celular, toque e segure a foto para salvar.</p>`:'<p class="err">Não encontrei essa foto. Confira a internet e tente de novo.</p>'}).catch(e=>{console.warn(e);const b=$('#ax');if(b)b.innerHTML='<p class="err">Não consegui abrir a foto. Confira a internet e tente de novo.</p>'})}
function openTx(tipo,tx){
  F=tx?{...tx,id:tx.id,valor:moneyInput(tx.valorCents),jaPago:tx.modo==='avista'&&tx.pagos?.[firstDate(tx).slice(0,7)]===true,err:'',valorVariavelAntes:tx.valorVariavel===true}:{tipo:tipo||'despesa',descricao:'',modo:'avista',valor:'',valorBase:'total',parcelas:2,parcelaInicial:1,data:TODAY,fim:'',categoria:tipo==='receita'?'Salário':'Alimentação',meio:'pix',cartaoId:'',jaPago:true,obs:'',err:'',valorVariavel:false,valorMes:''};
  if(F.cartaoId)F.meio='cartao';
  openDialog(`<div id="txf"></div>`);drawTxForm()}
function txPreview(){const vr=F.modo==='recorrente'&&F.valorVariavel;const c=parseMoney(F.valor)||0;if(!c&&!vr)return 'Digite o valor para ver como fica.';
  const tmp={...F,valorCents:c,parcelas:+F.parcelas||1,parcelaInicial:+F.parcelaInicial||1,cartaoId:F.meio==='cartao'?F.cartaoId:'',pagos:{}};const v=F.tipo==='receita'?'entra':'sai';
  if(tmp.parcelaInicial>tmp.parcelas)return 'A parcela inicial não pode ser maior que o total.';
  if(F.tipo==='despesa'&&F.meio==='cartao'&&!F.cartaoId)return 'Escolha o cartão para ver em qual fatura entra.';
  const nc=tmp.cartaoId==='__novo';if(nc&&!(+F.ncFecha>=1&&+F.ncFecha<=31&&+F.ncVenc>=1&&+F.ncVenc<=31))return 'Preencha fechamento e vencimento para ver em qual fatura entra.';
  if(nc)S.cards.push({id:'__novo',nome:F.ncNome||'novo',fecha:+F.ncFecha,venc:+F.ncVenc});
  try{return txPreview2(tmp,c,v,vr)}finally{if(nc)S.cards.pop()}}
function txPreview2(tmp,c,v,vr){
  const start=/^\d{4}-\d{2}-\d{2}$/.test(F.data)?firstDate(tmp):null;if(!start)return 'Escolha a data.';
  const card=tmp.cartaoId&&S.cards.find(x=>x.id===tmp.cartaoId),faturaTxt=card?` na fatura ${esc(card.nome)} de ${mShort(start.slice(0,7))} (vence ${dBr(start)})`:'';
  if(F.modo==='avista')return `${brl(c)} ${v} em ${dBr(start)}${faturaTxt}.`;
  if(vr)return `Valor muda todo mês. ${F.tipo==='receita'?'Entra':'Sai'} todo dia ${start.slice(8,10)} a partir de ${mShort(start.slice(0,7))}${F.fim?`, até ${mShort(F.fim)}`:''}${faturaTxt}. ${c?`Enquanto você não informar o valor do mês, a previsão usa ${brl(c)}.`:'Sem estimativa, a previsão conta zero até você informar o valor do mês.'}`;
  if(F.modo==='recorrente')return `${brl(c)} ${v} todo mês a partir de ${mShort(start.slice(0,7))}${F.fim?`, até ${mShort(F.fim)}`:', sem data para acabar'}${faturaTxt}.`;
  const os=occsOf(tmp,'9999-12'),tot=os.reduce((a,o)=>a+o.cents,0),ult=os[os.length-1];
  return `${os.length}x de ${brl(os[0].cents)}${faturaTxt}, da parcela ${tmp.parcelaInicial} à ${tmp.parcelas}, última em ${mShort(ult.key)}. ${tmp.parcelaInicial>1?'Falta':'Total'}: <b>${brl(tot)}</b>.`}
function drawTxForm(){const box=$('#txf');if(!box)return;const isD=F.tipo==='despesa',lockedDebt=!!F.debtId;
  if(lockedDebt){box.innerHTML=mHead('Pagamento de dívida')+`<div class="fm"><p class="fld w">${esc(F.descricao)}: ${brl(F.valorCents)} em ${dBr(F.data)}. Para corrigir, exclua e registre de novo em Dívidas. Excluir devolve o valor ao saldo da dívida.</p></div><div class="mf"><button class="btn danger" data-act="tx-del">${F.confirmDel?'Confirmar exclusão':'Excluir pagamento'}</button></div>`;return}
  box.innerHTML=mHead(F.id?'Editar lançamento':'Novo lançamento')+`<form id="txform" class="fm" novalidate>
    <div class="fld w">${seg('tipo',[['despesa','Despesa'],['receita','Receita']],F.tipo,true)}</div>
    <div class="fld w"><label for="f_desc">Descrição</label><input class="inp" id="f_desc" data-f="descricao" value="${esc(F.descricao)}" placeholder="${isD?'Ex.: mercado, iPhone, internet':'Ex.: salário, pró-labore'}" autocomplete="off"></div>
    <div class="fld w"><span class="lb">Forma</span>${seg('modo',[['avista','À vista'],['parcelado','Parcelado'],['recorrente','Recorrente']],F.modo)}</div>
    ${F.modo==='parcelado'?`<div class="fld"><label for="f_n">Total de parcelas</label><input class="inp" id="f_n" type="number" min="2" max="240" data-f="parcelas" value="${esc(F.parcelas)}"></div>
      <div class="fld"><label for="f_k">Começa na parcela</label><input class="inp" id="f_k" type="number" min="1" data-f="parcelaInicial" value="${esc(F.parcelaInicial)}"><span class="hint">Já em andamento? Ex.: 14 em 14/18.</span></div>`:''}
    ${F.modo==='recorrente'?`<div class="fld w"><label class="tog"><input type="checkbox" data-f="valorVariavel" ${F.valorVariavel?'checked':''}>O valor muda todo mês</label></div>`:''}
    ${F.modo==='recorrente'&&F.valorVariavel&&!F.id?`<div class="fld w"><label for="f_vm">Valor do primeiro mês (se já souber)</label><input class="inp" id="f_vm" inputmode="decimal" data-f="valorMes" value="${esc(F.valorMes||'')}" placeholder="0,00" autocomplete="off"></div>`:''}
    <div class="fld"><label for="f_val">${F.modo==='recorrente'?(F.valorVariavel?'Estimativa por mês (opcional)':'Valor por mês'):F.modo==='parcelado'?(F.valorBase==='parcela'?'Valor de cada parcela':'Valor total'):'Valor'}</label><input class="inp" id="f_val" inputmode="decimal" data-f="valor" value="${esc(F.valor)}" placeholder="0,00" autocomplete="off">${F.modo==='recorrente'&&F.valorVariavel?'<span class="hint">Use o menor valor que costuma acontecer, para a previsão não enganar.</span>':''}</div>
    ${F.modo==='parcelado'?`<div class="fld"><span class="lb">O valor digitado é</span>${seg('valorBase',[['total','O total'],['parcela','A parcela']],F.valorBase)}</div>`:`<div class="fld"><label for="f_cat0">Categoria</label><select class="sel" id="f_cat0" data-f="categoria">${catOptions(F.tipo,F.categoria)}</select></div>`}
    <div class="fld"><label for="f_dt">${F.meio==='cartao'&&isD?(F.modo==='parcelado'&&+F.parcelaInicial>1?`Data dentro da fatura da parcela ${esc(F.parcelaInicial)}`:'Data da compra'):F.modo==='parcelado'?(+F.parcelaInicial>1?`Vencimento da parcela ${esc(F.parcelaInicial)}`:'Vencimento da 1ª parcela'):F.modo==='recorrente'?'Primeiro vencimento':isD?'Data':'Data do recebimento'}</label><input class="inp" id="f_dt" type="date" data-f="data" value="${esc(F.data)}"></div>
    ${F.modo==='parcelado'?`<div class="fld"><label for="f_cat">Categoria</label><select class="sel" id="f_cat" data-f="categoria">${catOptions(F.tipo,F.categoria)}</select></div>`:F.modo==='recorrente'?`<div class="fld"><label for="f_fim">Termina em (opcional)</label><input class="inp" id="f_fim" type="month" data-f="fim" value="${esc(F.fim||'')}"></div>`:'<div class="fld" aria-hidden="true"></div>'}
    ${F.categoria==='__nova'?`<div class="fld"><label for="f_nc">Nome da categoria</label><input class="inp" id="f_nc" data-f="novaCat" value="${esc(F.novaCat||'')}"></div>${isD?`<div class="fld"><label for="f_ng">Grupo</label><select class="sel" id="f_ng" data-f="novoGrupo">${Object.keys(GRUPOS).map(g=>`<option value="${g}" ${F.novoGrupo===g?'selected':''}>${GRUPOS[g].nome}</option>`).join('')}</select></div>`:'<div></div>'}`:''}
    ${isD?`<div class="fld"><label for="f_meio">Pagamento</label><select class="sel" id="f_meio" data-f="pagamento">${Object.entries(MEIOS).map(([v,n])=>`<option value="${v}" ${F.meio===v?'selected':''}>${n}</option>`).join('')}</select></div>`:''}
    ${isD&&F.meio==='cartao'?`<div class="fld"><label for="f_card">Qual cartão</label><select class="sel" id="f_card" data-f="cartaoId">${F.cartaoId?'':'<option value="" selected>Escolha…</option>'}${S.cards.map(c=>`<option value="${c.id}" ${F.cartaoId===c.id?'selected':''}>${esc(c.nome)}${c.titular?' ('+esc(c.titular)+')':''}</option>`).join('')}<option value="__novo" ${F.cartaoId==='__novo'?'selected':''}>+ Cadastrar novo cartão</option></select></div>`:''}
    ${isD&&F.meio==='cartao'&&F.cartaoId==='__novo'?`<div class="fld"><label for="n_nome">Nome do cartão</label><input class="inp" id="n_nome" data-f="ncNome" value="${esc(F.ncNome||'')}" placeholder="Ex.: Nubank" autocomplete="off"></div><div class="fld"><label for="n_tit">Titular</label><input class="inp" id="n_tit" data-f="ncTitular" value="${esc(F.ncTitular||'')}" autocomplete="off"></div><div class="fld"><label for="n_fec">Dia do fechamento</label><input class="inp" id="n_fec" type="number" min="1" max="31" data-f="ncFecha" value="${esc(F.ncFecha||'')}"></div><div class="fld"><label for="n_ven">Dia do vencimento</label><input class="inp" id="n_ven" type="number" min="1" max="31" data-f="ncVenc" value="${esc(F.ncVenc||'')}"></div><div class="fld w"><label for="n_lim">Limite (opcional)</label><input class="inp" id="n_lim" inputmode="decimal" data-f="ncLimite" value="${esc(F.ncLimite||'')}" placeholder="0,00" autocomplete="off"></div>`:''}
    ${F.meio!=='cartao'||!isD?`<div class="fld" style="justify-content:flex-end">${F.modo==='avista'||!F.id?`<label class="tog"><input type="checkbox" data-f="jaPago" ${F.jaPago?'checked':''}>${isD?'Já paguei':'Já recebi'}${F.modo!=='avista'?' a primeira':''}</label>`:''}</div>`:''}
    ${anexosForm()}
    <div class="prev" id="txprev">${txPreview()}</div>
    ${F.err?`<div class="err">${esc(F.err)}</div>`:''}</form>
   <div class="mf">${F.id?`<button class="btn danger sp" data-act="tx-del">${F.confirmDel?(F.modo==='avista'?'Confirmar exclusão':'Apaga todas as parcelas e meses. Confirmar'):'Excluir'}</button>`:''}<button class="btn" data-act="close">Cancelar</button><button class="btn pri" data-act="tx-save">Salvar</button></div>`;}
async function saveTx(){const vrS=F.modo==='recorrente'&&F.valorVariavel===true;const c=parseMoney(F.valor)||(vrS?0:null);let err='';
  if(!F.descricao.trim())err='Dê um nome ao lançamento.';else if(!vrS&&(!c||c<=0))err='Digite um valor maior que zero.';else if(!/^\d{4}-\d{2}-\d{2}$/.test(F.data))err='Escolha uma data válida.';
  else if(F.modo==='parcelado'&&(+F.parcelas<2||+F.parcelaInicial<1||+F.parcelaInicial>+F.parcelas))err='Confira o número de parcelas.';
  else if(F.categoria==='__nova'&&!(F.novaCat||'').trim())err='Dê um nome à categoria nova.';
  else if(F.tipo==='despesa'&&F.meio==='cartao'&&!F.cartaoId)err='Escolha o cartão.';
  else if(F.tipo==='despesa'&&F.meio==='cartao'&&F.cartaoId==='__novo'&&(!(F.ncNome||'').trim()||!(+F.ncFecha>=1&&+F.ncFecha<=31)||!(+F.ncVenc>=1&&+F.ncVenc<=31)))err='Preencha nome, fechamento e vencimento do cartão (dias de 1 a 31).';
  if(err){F.err=err;drawTxForm();return}
  if(F.tipo==='despesa'&&F.meio==='cartao'&&F.cartaoId==='__novo'){const cid=uid(),cd={nome:F.ncNome.trim(),titular:(F.ncTitular||'').trim(),limiteCents:parseMoney(F.ncLimite)||0,fecha:+F.ncFecha,venc:+F.ncVenc};S.cards=[...S.cards,{id:cid,...cd}];dirty();F.cartaoId=cid;await write(()=>store.put('cards',cid,cd))}
  let cat=F.categoria,grupo=null;
  if(cat==='__nova'){const nome=F.novaCat.trim(),igual=x=>x.toLowerCase()===nome.toLowerCase(),rec=F.tipo==='receita',custom=(S.cfg.cats||[]).filter(c=>rec?c.grupo==='receita':c.grupo!=='receita'),jaCustom=custom.find(c=>igual(c.nome));
    let padrao=null,gp=null;if(rec)padrao=CAT_R.find(igual);else for(const g in CAT_D){const x=CAT_D[g].find(igual);if(x){padrao=x;gp=g}}
    if(padrao){cat=padrao;grupo=rec?null:gp}else if(jaCustom){cat=jaCustom.nome;grupo=rec?null:jaCustom.grupo}
    else{cat=nome;grupo=rec?'receita':(F.novoGrupo||'nao');const cats=[...(S.cfg.cats||[]),{nome:cat,grupo}];await write(()=>store.cfg(clean({...S.cfg,cats})))}}
  else if(F.tipo==='despesa'){const ex=(S.cfg.cats||[]).find(x=>x.nome===cat);grupo=ex?ex.grupo:null;if(!grupo)for(const g in CAT_D)if(CAT_D[g].includes(cat))grupo=g}
  const useCard=F.tipo==='despesa'&&F.meio==='cartao'&&F.cartaoId;
  const doc={tipo:F.tipo,descricao:F.descricao.trim(),modo:F.modo,valorCents:c,valorBase:F.modo==='parcelado'?F.valorBase:'total',data:F.data,categoria:cat,grupo,meio:F.tipo==='despesa'?F.meio:'pix',cartaoId:useCard?F.cartaoId:'',pagos:{...(F.pagos||{})},pagosEm:{...(F.pagosEm||{})},criadoEm:F.criadoEm||Date.now()};
  if(F.modo==='parcelado'){doc.parcelas=+F.parcelas;doc.parcelaInicial=+F.parcelaInicial}
  if(F.modo==='recorrente'&&F.fim)doc.fim=F.fim;
  const fk=firstDate(doc).slice(0,7);
  if(vrS){doc.valorVariavel=true;doc.valores={...(F.valores||{})};
    if(F.id&&!F.valorVariavelAntes){const old=S.tx.find(t=>t.id===F.id);if(old)for(const k in (old.pagos||{}))if(old.pagos[k]===true&&doc.valores[k]==null)doc.valores[k]=old.valorCents}
    const vm=parseMoney(F.valorMes);if(!F.id&&vm!=null)doc.valores[fk]=vm}
  else if(F.valores)doc.valores=F.valores;
  if(!useCard&&(F.modo==='avista'||!F.id)){if(F.jaPago){if(!(F.pagos||{})[fk])doc.pagosEm[fk]=Date.now();doc.pagos[fk]=true}else delete doc.pagos[fk]}
  const id=F.id||uid(),go2=fk,novos=F.novosAnexos||[],remov=F.anexosRemovidos||[];
  doc.anexos=[...(F.anexos||[]).filter(a=>!remov.includes(a.id)),...novos.map(a=>({id:a.id,w:a.w,h:a.h,criadoEm:Date.now()}))];
  closeDialog();if(novos.length)toast('Salvando a foto…');
  let fotosOk=true;for(const a of novos){try{const w=Promise.resolve(store.putAnexo(a.id,{dataUrl:a.dataUrl,txId:id,criadoEm:Date.now()}));if(navigator.onLine)await w;else w.catch(e=>console.warn(e))}catch(e){console.warn(e);fotosOk=false;doc.anexos=doc.anexos.filter(x=>x.id!==a.id)}}
  await write(()=>store.put('tx',id,clean(doc)),fotosOk?'Lançamento salvo':'Lançamento salvo, mas a foto não foi. Tente anexar de novo.');
  for(const r of remov)write(()=>store.delAnexo(r));
  if(S.page==='lancamentos'&&go2!==S.month&&!F?.id){S.month=go2;dirty();render(false)}}
function valForm(t,key){const cur=t.valores?.[key];
  openDialog(mHead('Valor de '+mLong(key))+`<form class="fm" id="valform" novalidate><p class="fld w">${esc(t.descricao)}</p><div class="fld w"><label for="v_c">${t.tipo==='receita'?'Quanto vai receber':'Quanto vai pagar'}</label><input class="inp" id="v_c" inputmode="decimal" value="${cur!=null?moneyInput(cur):''}" placeholder="0,00" autocomplete="off"><span class="hint">Vale só para este mês. Os próximos continuam na estimativa de ${brl(t.valorCents||0)}.</span></div><div class="err" id="v_e" hidden></div></form>
  <div class="mf"><button class="btn" data-act="close">Cancelar</button><button class="btn pri" data-act="val-save" data-id="${t.id}" data-k="${key}">Salvar</button></div>`);$('#v_c').focus()}
function debtForm(d){const v=d||{};
  openDialog(mHead(d?'Editar dívida':'Nova dívida')+`<form id="debtform" class="fm" novalidate>
   <div class="fld"><label for="d_cred">Credor</label><input class="inp" id="d_cred" name="credor" value="${esc(v.credor||'')}" placeholder="Ex.: banco, loja, pessoa"></div>
   <div class="fld"><label for="d_tipo">Tipo</label><select class="sel" id="d_tipo" name="tipo">${['Fatura de cartão','Rotativo','Empréstimo','Cheque especial','Financiamento','Acordo','Pessoa física','Outro'].map(t=>`<option ${v.tipo===t?'selected':''}>${t}</option>`).join('')}</select></div>
   <div class="fld"><label for="d_tit">Titular</label><input class="inp" id="d_tit" name="titular" value="${esc(v.titular||'')}" placeholder="Em nome de quem"></div>
   <div class="fld"><label for="d_saldo">Saldo atual</label><input class="inp" id="d_saldo" name="saldo" inputmode="decimal" value="${moneyInput(v.saldoCents)}" placeholder="0,00"></div>
   <div class="fld"><label for="d_jur">Juros ao mês (%)</label><input class="inp" id="d_jur" name="juros" inputmode="decimal" value="${v.jurosMes!=null?String(v.jurosMes).replace('.',','):''}" placeholder="Veja na fatura ou contrato"><span class="hint">Em branco = não sei ainda.</span></div>
   <div class="fld"><label for="d_par">Parcela ou mínimo por mês</label><input class="inp" id="d_par" name="parcela" inputmode="decimal" value="${moneyInput(v.parcelaCents)}" placeholder="0,00"></div>
   <div class="fld"><label for="d_rest">Parcelas restantes</label><input class="inp" id="d_rest" name="restantes" type="number" min="0" value="${v.parcelasRestantes??''}"></div>
   <div class="fld"><label for="d_ven">Dia do vencimento</label><input class="inp" id="d_ven" name="venc" type="number" min="1" max="31" value="${v.venc??''}"></div>
   <div class="fld"><label for="d_sit">Situação</label><select class="sel" id="d_sit" name="situacao">${[['em-dia','Em dia'],['atrasada','Atrasada'],['negociando','Negociando']].map(([a,b])=>`<option value="${a}" ${v.situacao===a?'selected':''}>${b}</option>`).join('')}</select></div>
   <div class="fld" style="justify-content:flex-end"><label class="tog"><input type="checkbox" name="negativada" ${v.negativada?'checked':''}>Negativada</label></div>
   <div class="fld w"><label for="d_obs">Observação</label><input class="inp" id="d_obs" name="obs" value="${esc(v.obs||'')}" placeholder="Desconto oferecido, acordo, quem cobra…"></div>
   <div class="err" id="d_err" hidden></div></form>
   <div class="mf">${d?`<button class="btn danger sp" data-act="debt-del" data-id="${d.id}">Excluir</button>`:''}<button class="btn" data-act="close">Cancelar</button><button class="btn pri" data-act="debt-save" data-id="${d?.id||''}">Salvar</button></div>`)}
async function saveDebt(id){const f=$('#debtform'),g=n=>f.elements[n].value.trim(),old=id&&S.debts.find(d=>d.id===id);const saldo=parseMoney(g('saldo')),par=parseMoney(g('parcela'));let jur=g('juros')?parseFloat(g('juros').replace(',','.')):null;
  const fail=m=>{const e=$('#d_err');e.textContent=m;e.hidden=false};
  if(!g('credor'))return fail('Informe o credor.');if(saldo==null)return fail('Informe o saldo atual, mesmo que aproximado.');if(jur!=null&&(isNaN(jur)||jur<0||jur>100))return fail('Juros: digite o percentual ao mês, entre 0 e 100.');
  const doc={credor:g('credor'),tipo:g('tipo'),titular:g('titular'),saldoCents:saldo,jurosMes:jur,parcelaCents:par||0,parcelasRestantes:g('restantes')===''?null:+g('restantes'),venc:g('venc')===''?null:+g('venc'),situacao:g('situacao'),negativada:f.elements.negativada.checked,obs:g('obs'),saldoInicial:old?Math.max(old.saldoInicial||0,saldo):saldo,pagamentos:old?.pagamentos||[],criadoEm:old?.criadoEm||Date.now()};
  closeDialog();await write(()=>store.put('debts',id||uid(),clean(doc)),'Dívida salva')}
function payDebtForm(d){const val=Math.min(d.parcelaCents||d.saldoCents,d.saldoCents);
  openDialog(mHead('Pagar '+esc(d.credor))+`<form class="fm" id="payform" novalidate><div class="fld"><label for="p_v">Valor pago</label><input class="inp" id="p_v" inputmode="decimal" value="${moneyInput(val)}"></div><div class="fld"><label for="p_d">Data</label><input class="inp" id="p_d" type="date" value="${TODAY}"></div>
    <div class="fld w"><label for="p_s">Saldo depois do pagamento</label><input class="inp" id="p_s" inputmode="decimal" value="${moneyInput(d.saldoCents-val)}"><span class="hint">Com juros, o banco pode mostrar outro número. Se puder, use o saldo do app dele.</span></div><div class="err" id="p_e" hidden></div></form>
    <div class="mf"><button class="btn" data-act="close">Cancelar</button><button class="btn pri" data-act="pay-save" data-id="${d.id}">Registrar pagamento</button></div>`);
  $('#p_v').addEventListener('input',e=>{const c=parseMoney(e.target.value);if(c!=null)$('#p_s').value=moneyInput(Math.max(0,d.saldoCents-c))})}
function cardForm(c){const v=c||{};
  openDialog(mHead(c?'Editar cartão':'Novo cartão')+`<form id="cardform" class="fm" novalidate><div class="fld"><label for="c_n">Nome</label><input class="inp" id="c_n" name="nome" value="${esc(v.nome||'')}" placeholder="Ex.: Nubank, Inter"></div><div class="fld"><label for="c_t">Titular</label><input class="inp" id="c_t" name="titular" value="${esc(v.titular||'')}"></div>
    <div class="fld"><label for="c_l">Limite</label><input class="inp" id="c_l" name="limite" inputmode="decimal" value="${moneyInput(v.limiteCents)}" placeholder="0,00"></div><div class="fld"></div>
    <div class="fld"><label for="c_f">Dia do fechamento</label><input class="inp" id="c_f" name="fecha" type="number" min="1" max="31" value="${v.fecha??''}"></div><div class="fld"><label for="c_v">Dia do vencimento</label><input class="inp" id="c_v" name="venc" type="number" min="1" max="31" value="${v.venc??''}"></div><div class="err" id="c_e" hidden></div></form>
    <div class="mf">${c?`<button class="btn danger sp" data-act="card-del" data-id="${c.id}">Excluir</button>`:''}<button class="btn" data-act="close">Cancelar</button><button class="btn pri" data-act="card-save" data-id="${c?.id||''}">Salvar</button></div>`)}
function faturaAsk(cardId,key){const c=S.cards.find(x=>x.id===cardId),val=occs(key).filter(o=>o.tx?.cartaoId===cardId&&!o.paid).reduce((a,o)=>a+o.cents,0);
  openDialog(mHead('Fatura '+esc(c?.nome||''))+`<div class="fm"><p class="fld w">Marcar como paga toda a fatura de ${mShort(key)}: <b>${brl(val)}</b>?</p><p class="fld w hint">Pagou só uma parte? O restante vira rotativo: cadastre esse valor em Dívidas com os juros da fatura.</p></div><div class="mf"><button class="btn" data-act="close">Cancelar</button><button class="btn pri" data-act="fatura-ok" data-card="${cardId}" data-k="${key}">Paguei a fatura inteira</button></div>`)}

/* ---------- eventos ---------- */
document.addEventListener('click',async e=>{
  const go_=e.target.closest('[data-go]');if(go_){go(go_.dataset.go);return}
  const sg=e.target.closest('[data-seg]');if(sg&&F){syncF();F[sg.dataset.seg]=sg.dataset.v;if(sg.dataset.seg==='tipo'){F.categoria=F.tipo==='receita'?'Salário':'Alimentação'}F.err='';drawTxForm();return}
  if(e.target.closest('[data-stop]')&&e.target.tagName!=='INPUT')return;
  const a=e.target.closest('[data-act]');if(!a)return;const act=a.dataset.act,id=a.dataset.id;
  const tx=id&&S.tx.find(t=>t.id===id),debt=id&&S.debts.find(d=>d.id===id),card=id&&S.cards.find(c=>c.id===id);
  switch(act){
    case 'rail':$('#app').classList.toggle('rail');ls.set('fd_rail',$('#app').classList.contains('rail'));setTimeout(drawCharts,480);break;
    case 'prev':setMonth(addM(S.month,-1));break;case 'next':setMonth(addM(S.month,1));break;case 'today':setMonth(CUR);break;
    case 'month':setMonth(a.dataset.k);break;
    case 'look':{const cur=getComputedStyle(document.documentElement).colorScheme.includes('light')?'light':'dark',nx=cur==='light'?'dark':'light';document.documentElement.dataset.theme=nx;ls.set('fd_look',nx);drawCharts();break}
    case 'accent':document.documentElement.dataset.accent=a.dataset.v;ls.set('fd_accent',a.dataset.v);renderSide();break;
    case 'new-tx':openTx('despesa');break;case 'new-desp':openTx('despesa');break;case 'new-rec':openTx('receita');break;
    case 'edit-tx':if(e.target.closest('label,input'))return;if(tx)openTx(tx.tipo,tx);break;
    case 'close':closeDialog();break;
    case 'tx-save':syncF();saveTx();break;
    case 'tx-del':if(!F)break;if(!F.confirmDel){syncF();F.confirmDel=true;drawTxForm();break}{const t=S.tx.find(x=>x.id===F.id);closeDialog();if(t)deleteTx(t)}break;
    case 'ver-anexo':if(tx?.anexos?.length){const L=tx.anexos;if(L.length===1)verAnexo(L[0].id,1,1);else openDialog(mHead('Fotos anexadas')+`<div class="mf" style="justify-content:flex-start;padding-top:14px">${L.map((x,i)=>`<button class="btn sm" data-act="ver-um" data-a="${x.id}" data-n="${i+1}" data-t="${L.length}">Foto ${i+1}</button>`).join('')}</div>`)}break;
    case 'ver-um':verAnexo(a.dataset.a,+a.dataset.n,+a.dataset.t);break;
    case 'anexo-rm':{if(!F)break;syncF();const i=a.dataset.id2;if((F.novosAnexos||[]).some(x=>x.id===i))F.novosAnexos=F.novosAnexos.filter(x=>x.id!==i);else F.anexosRemovidos=[...(F.anexosRemovidos||[]),i];drawTxForm();break}
    case 'set-saldo':saldoForm();break;
    case 'saldo-save':{const c=parseMoney($('#s_v').value);if(c==null){const er=$('#s_e');er.textContent='Digite o valor, mesmo que seja 0.';er.hidden=false;break}closeDialog();write(()=>store.cfg(clean({...S.cfg,saldoBase:{valorCents:c,data:TODAY,ts:Date.now()}})),'Saldo salvo');break}
    case 'set-val':if(tx)valForm(tx,a.dataset.k);break;
    case 'val-save':{const c=parseMoney($('#v_c').value);if(c==null||c<0){const er=$('#v_e');er.textContent='Digite o valor.';er.hidden=false;break}const k=a.dataset.k;closeDialog();write(()=>store.patch('tx',id,{valores:{[k]:c}}),'Valor salvo');break}
    case 'mark':if(tx)togglePaid(tx,a.dataset.k,true);break;
    case 'mark-box':e.stopPropagation();if(tx)togglePaid(tx,a.dataset.k,a.checked);break;
    case 'f-tipo':S.fTipo=a.dataset.v;render(false);break;
    case 'filter-cat':S.fCat=a.dataset.c;S.fTipo='todos';go('lancamentos');break;
    case 'new-debt':debtForm();break;case 'edit-debt':if(debt)debtForm(debt);break;
    case 'debt-save':saveDebt(id);break;
    case 'debt-del':if(a.dataset.sure){const i=id;closeDialog();write(()=>store.del('debts',i),'Dívida excluída')}else{a.dataset.sure='1';a.textContent='Confirmar exclusão'}break;
    case 'pay-debt':if(debt)payDebtForm(debt);break;
    case 'pay-save':{const v=parseMoney($('#p_v').value),dt=$('#p_d').value,sal=parseMoney($('#p_s').value);if(!v||v<=0||!dt||sal==null){const er=$('#p_e');er.textContent='Confira valor, data e saldo.';er.hidden=false;break}closeDialog();saveDebtPayment(debt,v,dt,sal);break}
    case 'strat':S.strategy=a.dataset.v;S.planMonths=null;renderPlan();break;
    case 'plan-more':S.planMonths=9999;renderPlan();break;
    case 'new-card':cardForm();break;case 'edit-card':if(card)cardForm(card);break;
    case 'card-save':{const f=$('#cardform'),g=n=>f.elements[n].value.trim(),fe=+g('fecha'),ve=+g('venc'),er=$('#c_e');if(!g('nome')||!(fe>=1&&fe<=31)||!(ve>=1&&ve<=31)){er.textContent='Preencha nome, fechamento e vencimento (dias de 1 a 31).';er.hidden=false;break}const d={nome:g('nome'),titular:g('titular'),limiteCents:parseMoney(g('limite'))||0,fecha:fe,venc:ve};const i=id||uid();closeDialog();write(()=>store.put('cards',i,d),'Cartão salvo');break}
    case 'card-del':if(a.dataset.sure){const i=id;closeDialog();write(()=>store.del('cards',i),'Cartão excluído')}else{a.dataset.sure='1';a.textContent='Compras voltam para a data original. Confirmar'}break;
    case 'ask-fatura':faturaAsk(a.dataset.card,a.dataset.k);break;
    case 'fatura-ok':{const c=a.dataset.card,k=a.dataset.k;closeDialog();payFatura(c,k);break}
    case 'day':S.day=a.dataset.d;render(false);break;
  }});
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('[role=button][data-act]')){e.preventDefault();e.target.dispatchEvent(new MouseEvent('click',{bubbles:true}))}});
function syncF(){if(!F)return;$$('#txf [data-f]').forEach(el=>applyField(el))}
function applyField(el){const f=el.dataset.f;if(el.type==='checkbox')F[f]=el.checked;else if(f==='pagamento'){F.meio=el.value;if(el.value==='cartao'){if(!F.cartaoId)F.cartaoId=S.cards.length===1?S.cards[0].id:(S.cards.length?'':'__novo')}else F.cartaoId=''}else F[f]=el.value}
document.addEventListener('input',e=>{
  if(e.target.dataset?.f&&F){applyField(e.target);const p=$('#txprev');if(p)p.innerHTML=txPreview();return}
  if(e.target.id==='f-text'){S.fText=e.target.value;$('#txlist').innerHTML=txListHtml();return}
  if(e.target.id==='extra'){const v=+e.target.value;S.cfg={...S.cfg,extraCents:v};$('#extra-v').textContent=brl(v);renderPlan()}});
document.addEventListener('change',async e=>{
  if(e.target.dataset?.anexo&&F){const files=[...e.target.files];e.target.value='';if(!files.length)return;syncF();const usados=(F.anexos||[]).filter(a=>!(F.anexosRemovidos||[]).includes(a.id)).length+(F.novosAnexos||[]).length;const livres=MAX_ANEXOS-usados;F.anexando=true;drawTxForm();let erro=false;
    for(const f of files.slice(0,livres)){try{const r=await comprimirFoto(f);if(!F)return;F.novosAnexos=[...(F.novosAnexos||[]),{id:uid(),...r}]}catch(er){console.warn(er);erro=true}}
    if(!F)return;F.anexando=false;F.err=erro?'Não consegui ler uma das fotos. Tente outra.':files.length>livres?`Limite de ${MAX_ANEXOS} fotos por lançamento.`:'';drawTxForm();return}
  if(e.target.dataset?.f&&F&&e.target.tagName==='SELECT'){applyField(e.target);drawTxForm();return}
  if(e.target.id==='f-cat'){S.fCat=e.target.value;$('#txlist').innerHTML=txListHtml()}
  if(e.target.id==='f-status'){S.fStatus=e.target.value;$('#txlist').innerHTML=txListHtml()}
  if(e.target.id==='extra'){write(()=>store.cfg(clean(S.cfg)))}
  if(e.target.dataset?.f==='data'&&F){if(!F.id)F.jaPago=F.data<=TODAY;drawTxForm()}
  if(e.target.dataset?.f==='valorVariavel'&&F){drawTxForm()}
  if(e.target.dataset?.f==='parcelaInicial'&&F){drawTxForm()}});
const tip=$('#tip');
document.addEventListener('mousemove',e=>{const t=e.target.closest?.('[data-tip]');if(!t){tip.style.opacity=0;return}tip.textContent=t.dataset.tip;tip.style.opacity=1;const w=tip.offsetWidth,h=tip.offsetHeight;tip.style.transform=`translate(${Math.max(8,Math.min(innerWidth-w-8,e.clientX+14))}px,${Math.max(8,e.clientY-h-10)}px)`});
let rz;new ResizeObserver(()=>{clearTimeout(rz);rz=setTimeout(drawCharts,120)}).observe(main);
addEventListener('hashchange',()=>{const p=location.hash.slice(1);if(PAGES.some(x=>x[0]===p)&&p!==S.page)go(p)});

/* ---------- início ---------- */

const F_=window.FB;
const fbApp=F_.initializeApp({apiKey:"AIzaSyAOvEFd4HlNHpaliH8PJF4Y-vW5rY_o4Pk",authDomain:"financas-do-davi.firebaseapp.com",projectId:"financas-do-davi",storageBucket:"financas-do-davi.firebasestorage.app",messagingSenderId:"290327965365",appId:"1:290327965365:web:7d22f8387102fbefd358fc"});
const auth=F_.getAuth(fbApp);
let fsdb;try{fsdb=F_.initializeFirestore(fbApp,{experimentalForceLongPolling:true,localCache:F_.persistentLocalCache({tabManager:F_.persistentSingleTabManager({forceOwnership:true})})})}catch(e){console.warn(e);fsdb=F_.initializeFirestore(fbApp,{experimentalForceLongPolling:true})}
const gate=$('#gate'),appEl=$('#app');let gMode='entrar',gMsg='',gErr='',gBusy=false;
const AUTH_ERR={'auth/invalid-credential':'E-mail ou senha incorretos.','auth/wrong-password':'E-mail ou senha incorretos.','auth/user-not-found':'E-mail ou senha incorretos.','auth/invalid-email':'Esse e-mail não é válido.','auth/weak-password':'Use uma senha com pelo menos 6 caracteres.','auth/email-already-in-use':'Já existe conta com esse e-mail. Use Entrar.','auth/too-many-requests':'Muitas tentativas. Espere alguns minutos.','auth/network-request-failed':'Sem conexão. Confira a internet.','auth/admin-restricted-operation':'Novos cadastros estão desativados neste app.','auth/operation-not-allowed':'Novos cadastros estão desativados neste app.'};
const authErr=e=>AUTH_ERR[e?.code]||'Não deu certo. Tente de novo.';
const LOGO=`<svg width="30" height="30" viewBox="150 150 724 724" aria-hidden="true"><path d="M270 226H500A286 286 0 0 1 500 798H270Z" fill="none" stroke="currentColor" stroke-width="84" stroke-linejoin="round"/><g fill="currentColor"><rect x="350" y="330" width="76" height="350" rx="20"/><rect x="456" y="470" width="76" height="210" rx="20"/><rect x="562" y="590" width="76" height="90" rx="20"/></g></svg>`;
function showGate(on){gate.hidden=!on;appEl.hidden=on;$('#bottom').hidden=on;$('.fab').hidden=on}
function drawGate(){const u=auth.currentUser;
  const head=`<div class="gbrand"><span class="mark">${LOGO}</span><div><b>Finanças do Davi</b><small>Sair das dívidas</small></div></div>`;
  if(u&&!u.emailVerified){gate.innerHTML=`<div class="gcard glass">${head}<h1>Confirme seu e-mail</h1><p>Enviamos um link para <b>${esc(u.email)}</b>. Abra o e-mail, confirme e volte aqui. Veja também o spam.</p>${gMsg?`<p class="gok">${esc(gMsg)}</p>`:''}${gErr?`<p class="err">${esc(gErr)}</p>`:''}<button class="btn pri" data-g="verif" ${gBusy?'disabled':''}>Já confirmei</button><div class="glinks"><button data-g="resend">Reenviar e-mail</button><button data-g="sair">Usar outra conta</button></div></div>`;return}
  const t={entrar:['Entrar','Entre com seu e-mail e senha.','Entrar'],criar:['Primeiro acesso','Crie sua senha. Depois você confirma pelo e-mail.','Criar conta'],esqueci:['Recuperar senha','Enviamos um link para criar uma senha nova.','Enviar link']}[gMode];
  gate.innerHTML=`<form class="gcard glass" id="gform" novalidate>${head}<h1>${t[0]}</h1><p>${t[1]}</p>
   <div class="fld"><label for="g_em">E-mail</label><input class="inp" id="g_em" type="email" autocomplete="username" inputmode="email" autocapitalize="off" required></div>
   ${gMode!=='esqueci'?`<div class="fld"><label for="g_pw">Senha</label><input class="inp" id="g_pw" type="password" autocomplete="${gMode==='criar'?'new-password':'current-password'}" required></div>`:''}
   ${gMsg?`<p class="gok">${esc(gMsg)}</p>`:''}${gErr?`<p class="err">${esc(gErr)}</p>`:''}
   <button class="btn pri" type="submit" ${gBusy?'disabled':''}>${gBusy?'Aguarde…':t[2]}</button>
   <div class="glinks">${gMode!=='entrar'?'<button type="button" data-g="m-entrar">Já tenho senha</button>':'<button type="button" data-g="m-criar">Primeiro acesso</button>'}${gMode!=='esqueci'?'<button type="button" data-g="m-esqueci">Esqueci a senha</button>':''}</div></form>`}
gate.addEventListener('submit',async e=>{e.preventDefault();const em=$('#g_em').value.trim(),pw=$('#g_pw')?.value||'';gErr='';gMsg='';gBusy=true;drawGate();$('#g_em').value=em;if($('#g_pw'))$('#g_pw').value=pw;
  try{if(gMode==='entrar')await F_.signInWithEmailAndPassword(auth,em,pw);
    else if(gMode==='criar'){const c=await F_.createUserWithEmailAndPassword(auth,em,pw);await F_.sendEmailVerification(c.user);gMsg='E-mail de confirmação enviado.'}
    else{await F_.sendPasswordResetEmail(auth,em);gMode='entrar';gMsg='Se o e-mail tiver conta, o link foi enviado.'}
  }catch(er){console.warn(er);gErr=authErr(er)}
  gBusy=false;if(!auth.currentUser||!auth.currentUser.emailVerified)drawGate()});
gate.addEventListener('click',async e=>{const b=e.target.closest('[data-g]');if(!b)return;const g=b.dataset.g;gErr='';gMsg='';
  if(g.startsWith('m-')){gMode=g.slice(2);drawGate();return}
  if(g==='sair'){await F_.signOut(auth);return}
  if(g==='resend'){try{await F_.sendEmailVerification(auth.currentUser);gMsg='E-mail reenviado.'}catch(er){gErr=authErr(er)}drawGate();return}
  if(g==='verif'){gBusy=true;drawGate();try{await auth.currentUser.reload();if(auth.currentUser.emailVerified){await auth.currentUser.getIdToken(true);gBusy=false;enter(auth.currentUser);return}gErr='Ainda não apareceu como confirmado. Abra o link do e-mail e tente de novo.'}catch(er){gErr=authErr(er)}gBusy=false;drawGate()}});
let entered=false,retried=false,curUser=null;
function subscribe(){
  store=fireStore(fsdb,curUser.uid);clearTimeout(unreachTimer);
  unreachTimer=setTimeout(()=>{if(!allLoaded()){S.unreach=true;render(false)}},15000);
  for(const k of Object.keys(COLS))store.watch(k,(rows)=>{S[k]=rows;S.loaded[k]=true;if(allLoaded()){clearTimeout(unreachTimer);S.unreach=false;S.dbErr=null}refresh()});
  store.watchCfg(c=>{const cur=S.cfg.extraCents;S.cfg=c||{};const f=$('#extra');if(f&&document.activeElement===f)S.cfg.extraCents=cur;refresh()})}
async function resubscribe(){store?.stop();store=null;try{if(navigator.onLine)await curUser.getIdToken(true)}catch(e){console.warn(e)}S.dbErr=null;S.unreach=false;render(false);subscribe()}
async function enter(user){if(entered)return;entered=true;curUser=user;retried=false;showGate(false);
  S.loaded={tx:false,debts:false,cards:false};S.tx=[];S.debts=[];S.cards=[];S.cfg={};S.dbErr=null;S.unreach=false;
  render(true);try{if(navigator.onLine)await user.getIdToken(true)}catch(e){console.warn(e)}
  if(entered)subscribe()}
document.addEventListener('click',e=>{const a=e.target.closest('[data-act2]');if(!a)return;
  if(a.dataset.act2==='retry'){retried=false;resubscribe()}
  if(a.dataset.act2==='sair'){clearTimeout(unreachTimer);store?.stop();store=null;entered=false;F_.signOut(auth)}
  if(a.dataset.act2==='backup'){const blob=new Blob([JSON.stringify({exportadoEm:new Date().toISOString(),lancamentos:S.tx,dividas:S.debts,cartoes:S.cards,config:S.cfg},null,2)],{type:'application/json'});const u=URL.createObjectURL(blob),l=document.createElement('a');l.href=u;l.download=`financas-davi-backup-${TODAY}.json`;document.body.appendChild(l);l.click();l.remove();setTimeout(()=>URL.revokeObjectURL(u),2000);toast('Backup gerado')}});
(function boot(){
  const look=ls.get('fd_look',null);if(look)document.documentElement.dataset.theme=look;
  document.documentElement.dataset.accent=ls.get('fd_accent','menta');
  if(ls.get('fd_rail',false))$('#app').classList.add('rail');
  const h=location.hash.slice(1);if(PAGES.some(x=>x[0]===h))S.page=h;
  if('serviceWorker' in navigator){let recarregou=false;const tinha=!!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!tinha||recarregou)return;recarregou=true;location.reload()});
    navigator.serviceWorker.register('sw.js?v=8',{updateViaCache:'none'}).then(r=>{const up=()=>r.update().catch(()=>{});document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')up()});setInterval(up,30*60*1000)}).catch(e=>console.warn(e))}
  F_.onAuthStateChanged(auth,u=>{if(u&&u.emailVerified){enter(u)}else{entered=false;showGate(true);drawGate()}});
})();
