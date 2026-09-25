
/* Pure trace engines. No DOM dependencies; also exercised by the repository tests. */
(function(root){
'use strict';
const META={
 bubble:{name:'Bubble sort',description:'Compare neighboring books and swap them when they are out of order. Each pass carries the largest remaining value to the right.',time:'O(n²)',space:'O(1)',note:'Stable · Best: O(n) with early exit. Worst: O(n²).',code:['for each shrinking pass','  compare neighboring values','  swap if left > right','  lock the last position','stop if no swaps occurred']},
 selection:{name:'Selection sort',description:'Search the unsorted region for its smallest value, then place that book at the front. Repeat until every position is filled.',time:'O(n²)',space:'O(1)',note:'Not stable · Best and worst: O(n²). Few swaps, but many comparisons.',code:['for each position i','  find the minimum on the right','  compare with current minimum','  swap minimum into position i','  lock position i']},
 insertion:{name:'Insertion sort',description:'Grow an ordered section from left to right. Pick up the next book and shift larger neighbors until it fits.',time:'O(n²)',space:'O(1)',note:'Stable · Best: O(n). Worst: O(n²). Useful for nearly sorted input.',code:['for each next book','  hold its value as key','  compare previous value to key','  shift larger values right','  insert key in the gap']},
 quick:{name:'Quick sort',description:'Choose the last value as a pivot. Move smaller or equal values to its left, then repeat on the two remaining regions.',time:'O(n log n)',space:'O(log n)*',note:'Not stable · Worst time: O(n²); worst stack: O(n). *Average recursion space. Last-element pivot.',code:['choose last value as pivot','compare each value to pivot','move smaller value to left','place pivot at final position','recurse on left and right']},
 merge:{name:'Merge sort',description:'Split the shelf into smaller regions. Merge each pair of ordered regions by repeatedly choosing the smaller leading value.',time:'O(n log n)',space:'O(n)',note:'Stable · Best and worst: O(n log n). Uses temporary arrays.',code:['split region into two halves','sort both halves recursively','compare leading values','write smaller value to shelf','copy remaining values']},
 bfs:{name:'Breadth-first search',description:'Explore nearby cells first using a queue. On this unweighted grid, the first route to the goal has the fewest steps.',time:'O(V + E)',space:'O(V)',note:'Shortest path guaranteed here · Four-direction movement, no diagonal edges. V = cells; E = links.',code:['enqueue start; mark discovered','remove next cell from queue','if goal: reconstruct path','enqueue undiscovered neighbors','repeat until queue is empty']},
 dfs:{name:'Depth-first search',description:'Follow one branch as far as possible using a stack, then return to explore alternatives. A found route need not be shortest.',time:'O(V + E)',space:'O(V)',note:'Not a shortest-path algorithm · Four-direction movement. V = cells; E = links.',code:['push start; mark discovered','pop next cell from stack','if goal: reconstruct path','push undiscovered neighbors','repeat until stack is empty']}
};
function sortTrace(input,algorithm){
 if(!['bubble','selection','insertion','quick','merge'].includes(algorithm))throw new Error('Unknown sorting algorithm');
 if(!Array.isArray(input)||input.length>100||input.some(x=>!Number.isFinite(x)))throw new Error('Expected up to 100 finite numbers');
 const a=input.slice(),frames=[],fixed=new Set();let comparisons=0,writes=0;
 const emit=(message,line,active=[],pivot=-1)=>frames.push({values:a.slice(),active:active.slice(),pivot,fixed:[...fixed],comparisons,writes,message,line});
 const compare=(i,j,line,pivot=-1)=>{comparisons++;emit('Compare '+a[i]+' with '+a[j]+'.',line,[i,j],pivot);};
 const swap=(i,j,line,pivot=-1)=>{if(i!==j){[a[i],a[j]]=[a[j],a[i]];writes+=2;emit('Swap positions '+(i+1)+' and '+(j+1)+'.',line,[i,j],pivot);}};
 emit('Ready. Press Visualize or Step to begin.',-1);
 if(algorithm==='bubble'){
  for(let end=a.length-1;end>0;end--){let changed=false;emit('Begin a pass through the unsorted region.',0);
   for(let j=0;j<end;j++){compare(j,j+1,1);if(a[j]>a[j+1]){swap(j,j+1,2);changed=true;}}
   fixed.add(end);emit('The largest remaining value is in its final position.',3);
   if(!changed){emit('No swaps this pass. The shelf is already ordered.',4);break;}
  }
 }else if(algorithm==='selection'){
  for(let i=0;i<a.length;i++){let min=i;emit('Find the minimum for position '+(i+1)+'.',0,[i]);
   for(let j=i+1;j<a.length;j++){compare(j,min,2);if(a[j]<a[min]){min=j;emit('A new minimum: '+a[min]+'.',1,[min]);}}
   swap(i,min,3);fixed.add(i);emit('Position '+(i+1)+' is final.',4,[i]);
  }
 }else if(algorithm==='insertion'){
  for(let i=1;i<a.length;i++){const key=a[i];let j=i-1;emit('Hold '+key+' as the key.',1,[i]);
   while(j>=0){comparisons++;emit('Compare '+a[j]+' with held key '+key+'.',2,[j]);if(a[j]<=key)break;a[j+1]=a[j];writes++;emit('Shift '+a[j]+' one position right; key '+key+' remains held.',3,[j,j+1]);j--;}
   a[j+1]=key;writes++;emit('Insert held key '+key+' into the gap.',4,[j+1]);
  }
 }else if(algorithm==='quick'){
  function quick(lo,hi){if(lo>hi)return;if(lo===hi){fixed.add(lo);return;}const pivot=a[hi];let i=lo;emit('Choose '+pivot+' as pivot.',0,[hi],hi);
   for(let j=lo;j<hi;j++){compare(j,hi,1,hi);if(a[j]<=pivot){swap(i,j,2,hi);i++;}}
   swap(i,hi,3);fixed.add(i);emit('Pivot '+pivot+' is in its final position.',3,[i],i);emit('Sort the regions on either side of the pivot.',4);quick(lo,i-1);quick(i+1,hi);
  }quick(0,a.length-1);
 }else{
  function merge(lo,hi){if(hi-lo<2)return;const mid=Math.floor((lo+hi)/2);emit('Split positions '+(lo+1)+'–'+hi+'.',0);merge(lo,mid);merge(mid,hi);emit('Merge two sorted regions.',1);const left=a.slice(lo,mid),right=a.slice(mid,hi);let i=0,j=0,k=lo;
   while(i<left.length&&j<right.length){comparisons++;emit('Compare buffered values '+left[i]+' and '+right[j]+'.',2,[k]);a[k]=left[i]<=right[j]?left[i++]:right[j++];writes++;emit('Write '+a[k]+' from the merge buffer.',3,[k]);k++;}
   while(i<left.length){a[k]=left[i++];writes++;emit('Copy remaining value '+a[k]+'.',4,[k]);k++;}
   while(j<right.length){a[k]=right[j++];writes++;emit('Copy remaining value '+a[k]+'.',4,[k]);k++;}
  }merge(0,a.length);
 }
 for(let i=0;i<a.length;i++)fixed.add(i);
 emit('Complete. Every book is in ascending order.',-1);return frames;
}
function searchGrid(rows,cols,walls,start,goal,algorithm){
 const n=rows*cols;
 if(!Number.isInteger(rows)||!Number.isInteger(cols)||rows<1||cols<1||n>2500||!Number.isInteger(start)||!Number.isInteger(goal)||start<0||goal<0||start>=n||goal>=n||!['bfs','dfs'].includes(algorithm))throw new Error('Invalid grid search');
 const blocked=new Set(walls),visited=[],path=[],parent=new Map(),seen=new Set([start]),frontier=[start];let head=0,found=false;
 if(blocked.has(start)||blocked.has(goal))return {visited,path,found};
 while(algorithm==='bfs'?head<frontier.length:frontier.length>0){const cell=algorithm==='bfs'?frontier[head++]:frontier.pop();visited.push(cell);if(cell===goal){found=true;break;}
  const r=Math.floor(cell/cols),c=cell%cols,neighbors=[];
  if(r>0)neighbors.push(cell-cols);if(c<cols-1)neighbors.push(cell+1);if(r<rows-1)neighbors.push(cell+cols);if(c>0)neighbors.push(cell-1);
  if(algorithm==='dfs')neighbors.reverse();
  for(const next of neighbors)if(!blocked.has(next)&&!seen.has(next)){seen.add(next);parent.set(next,cell);frontier.push(next);}
 }
 if(found){let current=goal;while(current!==undefined){path.push(current);current=parent.get(current);}path.reverse();}
 return {visited,path,found};
}
root.AlgoShelf={META,sortTrace,searchGrid};
})(globalThis);
