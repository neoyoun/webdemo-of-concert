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
			delay : 0
		}
		let config = Object.assign(defaultConfig,userConfig);
		let childs = self.childNodes;
		let listBox,prevBtn,nextBtn;

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
		for (let i = 0; i < slideItems.length; i++) {
			slideItems[i].style.width = self.offsetWidth + 'px';
			slideItems[i].style.height = self.offsetHeight + 'px';
		}
		listBox.style.width = (slideItems[0].offsetWidth * (slideItems.length+1)) +'px';
		let copyItem = listBox.firstElementNode.cloneNode();

		if( self.classList.contains('slide')){
			startAutoSlide(config)
		}

		function startAutoSlide(config) {
			let interval = config.interval;
			let direction = config.direction;
		}


}
Object.defineProperty(HTMLElement.prototype,'slide',{
			value : CarouselComponent
		})