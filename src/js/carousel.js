let CarouselComponent = function (userConfig) {
		let self = this;
		let slideItems = self.querySelectorAll('.slide-item');
		if( slideItems.length <= 0 ){
			throw new Error("Element which you want to slide must contain class name '.slide-item'");
			return false;
		}
		const defaultConfig = {
			interval : 5000,
			direction : 'left',
			pause : 'hover'
		}
		let childs = self.childNodes;
		let config,listBox,prevBtn,nextBtn;

		if( userConfig !== undefined ){
			if( typeof userConfig === Object ){
				config = Object.assign(defaultConfig,userConfig);
			}else if ( typeof userConfig === 'string' ){
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
			}
		}else {
			config = defaultConfig;
		}
		
// find slide items's wraper
		for (let i = 0; i < childs.length; i++) {
			if(childs[i].nodeType == 1 && childs[i].getAttribute('role')){
				if( childs[i].getAttribute('role') == 'list-box'){
					listBox = childs[i];
				}
			}
		}
		if( !listBox ){
			console.error('slide item must be wraped');
			return false;
		}

initialDOM(config);

 function initialDOM(config) {
  /*
	 *初始化节点，包括样式和DOM结构的创建。
	 *防止滚动到最后一个节点的时候出现空白，在头一个滚动的
	 *的节点复制到队列最后。
	 *因此样式上盒子的宽度比滚动项多一个。高度在css中设置一致。
	 *滚动项的高度和宽度保持和祖先元素一致；
	 *最后调用动画方法
	 */
	for (let i = 0; i < slideItems.length; i++) {
			slideItems[i].style.width = self.offsetWidth + 'px';
			slideItems[i].style.height = self.offsetHeight + 'px';
		}
	listBox.style.width = (slideItems[0].offsetWidth * (slideItems.length+1)) +'px';
	
	if( config.direction == 'left' ){
		let copyItem = listBox.firstElementChild.cloneNode(true);
		listBox.appendChild(copyItem)
	}else {
		let copyItem = listBox.lastElementChild.cloneNode(true);
		listBox.insertBefore(copyItem , listBox.firstElementNode);
	}
	return startSlide(config);
}

function startSlide(config) {
	let interval = config.interval;
	let direction = config.direction;
	let step = self.offsetWidth;
	let curSlideIndex = 0;

	switch(direction) {
		case 'left':
			slideToLeft();
			break;
		case 'right':
			slideToRight();
			break;
		default :
			break;
	}

	function slideToLeft() {
		let timer = setInterval(function () {
			if( curSlideIndex == slideItems.length ){
				curSlidePos = curSlideIndex * step;
				curSlideIndex = 0;
				listBox.style.transitionDuration = '.3s';
				listBox.style.transform = 'translate3d(-'+curSlidePos + 'px, 0 ,0)';
				setTimeout(function () {
					listBox.style.transitionDuration = '0s';
					listBox.style.transform = 'translate3d(0, 0 ,0)';
				}, 300)
				
			}else {
				curSlideIndex ++ ;
				curSlidePos = curSlideIndex * step;
				listBox.style.transitionDuration = '.3s';
				listBox.style.transform = 'translate3d(-'+curSlidePos + 'px, 0 ,0)';
			}
			
			}, interval)
	}
	
}
		

}
Object.defineProperty(HTMLElement.prototype,'slide',{
			value : CarouselComponent
		})