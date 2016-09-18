let CarouselComponent = function (userConfig) {
		const defaultConfig = {
			interval : 5000,
			direction : 'left',
			pause : 'hover'
		}
		let self = this;
		let step = self.offsetWidth;
		let listBox,slideItems,itemsCount,prevBtn,nextBtn,indicator;
		let childs = self.getElementsByTagName('*');
		// find slide items's wraper and slide item;
		(function findDOM() {
			for (let i = 0; i < childs.length; i++) {
					if(childs[i].nodeType == 1) {
						if( childs[i].getAttribute('role') && childs[i].getAttribute('role') == 'list-box'){
							listBox = childs[i];
						 }
						if( childs[i].dataset['slide'] ){
							let btnDirection = childs[i].dataset['slide'];

							if( btnDirection == 'prev') {prevBtn = childs[i]}
							if( btnDirection == 'next') {nextBtn = childs[i]}
						}
					}
				}
			if( !listBox ){
					console.error('slide item must be wraped');
					return false;
				}
			//鼠标移入移出事件；
			listBox.addEventListener('mouseover' , pauseAutoSlide )
			listBox.addEventListener('mouseout' , pauseAutoSlide )
			if( prevBtn && nextBtn ){
					prevBtn.addEventListener('click', slideToPrev )
					nextBtn.addEventListener('click', slideToNext )
				}
				
		 	slideItems = listBox.querySelectorAll('.slide-item');
			itemsCount = slideItems.length;
			if( slideItems.length <= 0 ){
				throw new Error("Element which you want to slide must contain class name '.slide-item'");
				return false;
			}
			
		})();
		let config = defaultConfig;
		if( typeof userConfig === 'string' ){
				switch(userConfig) {
					case 'hover':
						pauseAutoSlide();
						break;
					case 'prev':
						slideToPrev();
						break;
					case 'next':
						slideToNext();
						break;
					default :
						break;
				}
		}else{
			if (typeof userConfig === 'object' ) {
				config = Object.assign(config,userConfig);
			}
		}
		let curSlideIndex = 0;
		let curSlidePos = listBox.style.transform;
		//获得当前滚动位置长度，根据滚动位置判断居中项索引
		if( curSlidePos ){
			curSlidePos = -(curSlidePos.split('(')[1].split('px')[0]);
			curSlideIndex = (curSlidePos / step)-1;
		}
		

	isInitialEnter()? initialDOM() :'';
 function isInitialEnter() {
 	let nodes = [];
 	for(let i = 0; i<listBox.childNodes.length;i++){
 		if( listBox.childNodes[i].nodeType == 1 ){
 			nodes.push( listBox.childNodes[i].innerHTML)
 		}
 	}
 	let noRepeatNodes = new Set(nodes);
 	return nodes.length == noRepeatNodes.size;
 }

 function initialDOM() {
  /*
	 *初始化节点，只调用一次。包括样式和DOM结构的创建。
	 *防止滚动到最后一个节点的时候出现空白，在头一个滚动的
	 *的节点复制到队列最后。
	 *因此样式上盒子的宽度比滚动项多一个。高度在css中设置一致。
	 *滚动项的高度和宽度保持和祖先元素一致；
	 *最后调用动画方法
	 */
		for (let i = 0; i < itemsCount; i++) {
			slideItems[i].style.width = self.offsetWidth + 'px';
			slideItems[i].style.height = self.offsetHeight + 'px';
		}
		listBox.style.width = (slideItems[0].offsetWidth * (itemsCount+2)) +'px';
	
		let lastItem = listBox.lastElementChild.cloneNode(true);
		let firstItem = listBox.firstElementChild.cloneNode(true);
		firstItem.classList.remove('active');
		lastItem.classList.remove('active');
		listBox.appendChild(firstItem);
		listBox.insertBefore(lastItem,listBox.firstElementChild);
		listBox.style.transform = 'translate3d(-'+step + 'px, 0 ,0)';

		itemsCount = itemsCount+2;
		if(self.className.indexOf('slide') > -1){startAutoSlide(config.direction)};
}

function startAutoSlide(direction) {
	/*
	 *自动滚动方法
	 *需要添加 .slide 类名 才执行自动方法
	 *
	 */
	if(self.className.indexOf('slide') < 0 ) return;
		self.timer = setInterval(function () {
		if( direction == 'right'){
			curSlideIndex--;
		}else {
			curSlideIndex++;
		}
		setListBoxPos(curSlideIndex)
		}, config.interval)
	
}
function setListBoxPos(index) {
	curSlideIndex = index;
	//console.log(`index=>${curSlideIndex},itemsCount=>${itemsCount}`);
	listBox.style.transitionDuration = '.3s';
	listBox.style.transform = 'translate3d(-'+ (curSlideIndex+1)*step + 'px, 0 ,0)';
	if( curSlideIndex < 0 ){
			setTimeout(function () {
				listBox.style.transitionDuration = '0s';
				listBox.style.transform = 'translate3d(-'+ ((itemsCount-2)*step) +'px, 0 ,0)';
			}, 300)
			curSlideIndex = itemsCount - 3;
		}else if( curSlideIndex >= (itemsCount - 2) ){
			setTimeout(function () {
				listBox.style.transitionDuration = '0s';
				listBox.style.transform = 'translate3d(-'+ step +'px, 0 ,0)';
			}, 300)
			curSlideIndex = 0;
		}
}
function slideToNext(e) {
		e.stopPropagation();
		e.preventDefault();
		clearInterval(self.timer);
		curSlideIndex++;
		setListBoxPos(curSlideIndex);
		startAutoSlide(config.direction);
	}
function slideToPrev(e) {
		e.stopPropagation();
		e.preventDefault();
		clearInterval(self.timer);
		curSlideIndex--;
		setListBoxPos(curSlideIndex);
		startAutoSlide(config.direction);
	}		
function pauseAutoSlide(e) {
		e.stopPropagation();
		e.preventDefault();
		if(config.pause == 'hover') {
			if(self.timer){
				clearInterval(self.timer);
				self.timer = null;
			}else {
				startAutoSlide(config.direction);
			}
	}		
}
}
Object.defineProperty(HTMLElement.prototype,'slide',{
			value : CarouselComponent
		})