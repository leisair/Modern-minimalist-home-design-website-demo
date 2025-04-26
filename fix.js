console.log('直接修复CSS冲突');

// 修复图片滑动问题的专用JavaScript
// 处理异步加载组件的问题，确保滑动功能正确初始化
document.addEventListener('DOMContentLoaded', function() {
    // 等待hero.html组件加载完成后再初始化滑动功能
    setTimeout(function checkAndInitSlider() {
        const slider = document.getElementById('design-slider');
        if (!slider) {
            console.log('等待slider元素加载...');
            setTimeout(checkAndInitSlider, 500); // 每500ms检查一次
            return;
        }
        
        console.log('滑动组件已找到，开始初始化...');
        
        const sliderContainer = document.getElementById('slider-container');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const dots = document.querySelectorAll('#slider-dots button');
        
        if (!sliderContainer || !prevBtn || !nextBtn || dots.length === 0) {
            console.log('滑动相关元素未完全加载，继续等待...');
            setTimeout(checkAndInitSlider, 500);
            return;
        }
        
        console.log('所有滑动元素已加载，初始化滑动逻辑');
        
        let currentIndex = 0;
        const slideCount = sliderContainer.children.length;
        let startX, moveX, initialPosition, canSlide = false;
        
        console.log(`找到${slideCount}张幻灯片`);
        
        // 更新指示器
        function updateDots() {
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.remove('bg-white/50');
                    dot.classList.add('bg-white');
                } else {
                    dot.classList.add('bg-white/50');
                    dot.classList.remove('bg-white');
                }
            });
        }
        
        // 设置滑块位置
        function setSliderPosition(index) {
            currentIndex = index;
            sliderContainer.style.transform = `translateX(-${index * 100}%)`;
            updateDots();
            console.log(`滑动到第${index + 1}张图片`);
        }
        
        // 初始化
        setSliderPosition(0);
        
        // 自动切换
        let autoSlideInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % slideCount;
            setSliderPosition(currentIndex);
        }, 5000);
        
        // 按钮事件
        prevBtn.addEventListener('click', () => {
            console.log('点击上一张');
            clearInterval(autoSlideInterval);
            currentIndex = (currentIndex - 1 + slideCount) % slideCount;
            setSliderPosition(currentIndex);
            
            // 重新开始自动切换
            autoSlideInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % slideCount;
                setSliderPosition(currentIndex);
            }, 5000);
        });
        
        nextBtn.addEventListener('click', () => {
            console.log('点击下一张');
            clearInterval(autoSlideInterval);
            currentIndex = (currentIndex + 1) % slideCount;
            setSliderPosition(currentIndex);
            
            // 重新开始自动切换
            autoSlideInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % slideCount;
                setSliderPosition(currentIndex);
            }, 5000);
        });
        
        // 点击指示器切换
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                console.log('点击指示器');
                clearInterval(autoSlideInterval);
                const index = parseInt(dot.dataset.index);
                setSliderPosition(index);
                
                // 重新开始自动切换
                autoSlideInterval = setInterval(() => {
                    currentIndex = (currentIndex + 1) % slideCount;
                    setSliderPosition(currentIndex);
                }, 5000);
            });
        });
        
        // 触摸事件
        slider.addEventListener('touchstart', (e) => {
            console.log('触摸开始');
            clearInterval(autoSlideInterval);
            startX = e.touches[0].clientX;
            initialPosition = -currentIndex * 100;
            canSlide = true;
            
            // 添加过渡取消，使滑动更流畅
            sliderContainer.style.transition = 'none';
        });
        
        slider.addEventListener('touchmove', (e) => {
            if (!canSlide) return;
            moveX = e.touches[0].clientX;
            const diff = moveX - startX;
            const newPosition = initialPosition + (diff / slider.offsetWidth) * 100;
            
            // 限制滑动范围
            if (newPosition > 0 || newPosition < -((slideCount - 1) * 100)) return;
            
            sliderContainer.style.transform = `translateX(${newPosition}%)`;
        });
        
        slider.addEventListener('touchend', (e) => {
            if (!canSlide) return;
            canSlide = false;
            console.log('触摸结束');
            
            // 恢复过渡效果
            sliderContainer.style.transition = 'transform 500ms ease-out';
            
            const diff = moveX - startX;
            if (Math.abs(diff) > slider.offsetWidth / 4) {
                if (diff > 0 && currentIndex > 0) {
                    currentIndex--;
                } else if (diff < 0 && currentIndex < slideCount - 1) {
                    currentIndex++;
                }
            }
            
            setSliderPosition(currentIndex);
            
            // 重新开始自动切换
            autoSlideInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % slideCount;
                setSliderPosition(currentIndex);
            }, 5000);
        });
        
        // 鼠标事件（适用于桌面端）
        slider.addEventListener('mousedown', (e) => {
            console.log('鼠标按下');
            clearInterval(autoSlideInterval);
            e.preventDefault();
            startX = e.clientX;
            initialPosition = -currentIndex * 100;
            canSlide = true;
            
            // 添加过渡取消，使滑动更流畅
            sliderContainer.style.transition = 'none';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!canSlide) return;
            moveX = e.clientX;
            const diff = moveX - startX;
            const newPosition = initialPosition + (diff / slider.offsetWidth) * 100;
            
            // 限制滑动范围
            if (newPosition > 0 || newPosition < -((slideCount - 1) * 100)) return;
            
            sliderContainer.style.transform = `translateX(${newPosition}%)`;
        });
        
        document.addEventListener('mouseup', () => {
            if (!canSlide) return;
            canSlide = false;
            console.log('鼠标松开');
            
            // 恢复过渡效果
            sliderContainer.style.transition = 'transform 500ms ease-out';
            
            if (!moveX) {
                setSliderPosition(currentIndex);
                return;
            }
            
            const diff = moveX - startX;
            if (Math.abs(diff) > slider.offsetWidth / 4) {
                if (diff > 0 && currentIndex > 0) {
                    currentIndex--;
                } else if (diff < 0 && currentIndex < slideCount - 1) {
                    currentIndex++;
                }
            }
            
            setSliderPosition(currentIndex);
            
            // 重新开始自动切换
            autoSlideInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % slideCount;
                setSliderPosition(currentIndex);
            }, 5000);
        });
        
        // 离开时取消滑动状态
        slider.addEventListener('mouseleave', () => {
            if (canSlide) {
                canSlide = false;
                sliderContainer.style.transition = 'transform 500ms ease-out';
                setSliderPosition(currentIndex);
            }
        });
        
        console.log('滑动功能初始化完成');
    }, 1000); // 延迟1秒后开始检查

    // 功能区图片对比滑块功能初始化
    setTimeout(function initFeatureComparisonSliders() {
        console.log('正在初始化功能区对比滑块...');
        const sliders = document.querySelectorAll('.image-comparison-slider');
        
        if (!sliders || sliders.length === 0) {
            console.log('功能区对比滑块未找到，稍后重试...');
            setTimeout(initFeatureComparisonSliders, 1000);
            return;
        }
        
        console.log(`找到 ${sliders.length} 个对比滑块，初始化中...`);
        
        sliders.forEach((slider, index) => {
            const afterDiv = slider.querySelector('.comparison-after');
            const sliderHandle = slider.querySelector('.slider-handle');
            
            if (!afterDiv || !sliderHandle) {
                console.log(`滑块 #${index+1} 内部元素缺失`);
                return;
            }
            
            // 添加右箭头指示符（如果不存在）
            if (!sliderHandle.querySelector('.right-arrow')) {
                const rightArrow = document.createElement('span');
                rightArrow.className = 'right-arrow';
                sliderHandle.appendChild(rightArrow);
            }
            
            let isDown = false;
            let startX;
            let startWidth;
            
            // 确保初始位置设为50%
            afterDiv.style.width = '50%';
            
            // 鼠标按下事件处理
            function handleMouseDown(e) {
                e.preventDefault();
                e.stopPropagation();
                isDown = true;
                slider.classList.add('sliding');
                
                // 正确获取clientX，无论是鼠标事件还是触摸事件
                startX = e.clientX || (e.touches && e.touches[0].clientX);
                startWidth = afterDiv.offsetWidth;
                
                console.log(`滑块 #${index+1} 开始拖动，初始宽度: ${startWidth}px`);
            }
            
            // 鼠标移动事件处理
            function handleMouseMove(e) {
                if (!isDown) return;
                e.preventDefault();
                e.stopPropagation();
                
                // 正确获取clientX，无论是鼠标事件还是触摸事件
                const clientX = e.clientX || (e.touches && e.touches[0].clientX);
                const walk = clientX - startX;
                
                let newWidth = startWidth + walk;
                newWidth = Math.max(0, Math.min(slider.offsetWidth, newWidth));
                const percentage = (newWidth / slider.offsetWidth) * 100;
                
                console.log(`滑块 #${index+1} 拖动中: ${percentage.toFixed(1)}%`);
                afterDiv.style.width = `${percentage}%`;
            }
            
            // 鼠标释放事件处理
            function handleMouseUp() {
                if (!isDown) return;
                isDown = false;
                slider.classList.remove('sliding');
                console.log(`滑块 #${index+1} 拖动结束`);
            }
            
            // 双击重置事件
            function handleDoubleClick() {
                afterDiv.style.width = '50%';
                console.log(`滑块 #${index+1} 双击重置到50%`);
            }
            
            // 清除可能存在的旧事件监听器
            sliderHandle.removeEventListener('mousedown', handleMouseDown);
            sliderHandle.removeEventListener('touchstart', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('touchmove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchend', handleMouseUp);
            slider.removeEventListener('dblclick', handleDoubleClick);
            
            // 添加新的事件监听器
            sliderHandle.addEventListener('mousedown', handleMouseDown);
            sliderHandle.addEventListener('touchstart', handleMouseDown, { passive: false });
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('touchmove', handleMouseMove, { passive: false });
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('touchend', handleMouseUp);
            slider.addEventListener('dblclick', handleDoubleClick);
            
            // 显示初始提示
            const instruction = slider.querySelector('.slider-instruction');
            if (instruction) {
                instruction.style.opacity = '1';
                instruction.style.transform = 'translateY(0)';
                setTimeout(() => {
                    instruction.style.opacity = '0';
                    instruction.style.transform = 'translateY(-10px)';
                }, 5000);
            }
            
            console.log(`滑块 #${index+1} 初始化完成`);
        });
        
        console.log('所有功能区对比滑块初始化完成');
    }, 2000); // 等待2秒再初始化功能区滑块，确保组件已加载
});

// 额外添加一个全局变量来监听和处理DOM变化，确保动态加载的内容也能正确初始化
(function() {
    // 监听DOM变化
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                // 检查是否有新的对比滑块元素加入
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        const sliders = node.querySelectorAll ? node.querySelectorAll('.image-comparison-slider') : [];
                        if (sliders.length > 0 || (node.classList && node.classList.contains('image-comparison-slider'))) {
                            console.log('检测到新的对比滑块元素，初始化中...');
                            initDynamicSliders(node.classList && node.classList.contains('image-comparison-slider') ? [node] : sliders);
                        }
                    }
                });
            }
        });
    });
    
    // 初始化动态加载的滑块
    function initDynamicSliders(sliders) {
        sliders.forEach((slider, index) => {
            const afterDiv = slider.querySelector('.comparison-after');
            const sliderHandle = slider.querySelector('.slider-handle');
            
            if (!afterDiv || !sliderHandle) return;
            
            // 添加右箭头指示符（如果不存在）
            if (!sliderHandle.querySelector('.right-arrow')) {
                const rightArrow = document.createElement('span');
                rightArrow.className = 'right-arrow';
                sliderHandle.appendChild(rightArrow);
            }
            
            let isDown = false;
            let startX;
            let startWidth;
            
            // 确保初始位置设为50%
            afterDiv.style.width = '50%';
            
            // 鼠标按下事件处理
            function handleMouseDown(e) {
                e.preventDefault();
                e.stopPropagation();
                isDown = true;
                slider.classList.add('sliding');
                
                // 正确获取clientX，无论是鼠标事件还是触摸事件
                startX = e.clientX || (e.touches && e.touches[0].clientX);
                startWidth = afterDiv.offsetWidth;
            }
            
            // 鼠标移动事件处理
            function handleMouseMove(e) {
                if (!isDown) return;
                e.preventDefault();
                e.stopPropagation();
                
                // 正确获取clientX，无论是鼠标事件还是触摸事件
                const clientX = e.clientX || (e.touches && e.touches[0].clientX);
                const walk = clientX - startX;
                
                let newWidth = startWidth + walk;
                newWidth = Math.max(0, Math.min(slider.offsetWidth, newWidth));
                const percentage = (newWidth / slider.offsetWidth) * 100;
                
                afterDiv.style.width = `${percentage}%`;
            }
            
            // 鼠标释放事件处理
            function handleMouseUp() {
                if (!isDown) return;
                isDown = false;
                slider.classList.remove('sliding');
            }
            
            // 双击重置事件
            function handleDoubleClick() {
                afterDiv.style.width = '50%';
            }
            
            // 清除可能存在的旧事件监听器
            sliderHandle.removeEventListener('mousedown', handleMouseDown);
            sliderHandle.removeEventListener('touchstart', handleMouseDown);
            
            // 添加新的事件监听器
            sliderHandle.addEventListener('mousedown', handleMouseDown);
            sliderHandle.addEventListener('touchstart', handleMouseDown, { passive: false });
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('touchmove', handleMouseMove, { passive: false });
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('touchend', handleMouseUp);
            slider.addEventListener('dblclick', handleDoubleClick);
            
            console.log(`动态滑块 #${index+1} 初始化完成`);
        });
    }
    
    // 开始监听文档变化
    observer.observe(document.body, { childList: true, subtree: true });
    
    // 在页面加载后尝试初始化所有滑块
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(function() {
                const sliders = document.querySelectorAll('.image-comparison-slider');
                if (sliders.length > 0) {
                    console.log('页面加载完成，初始化所有对比滑块');
                    initDynamicSliders(sliders);
                }
            }, 2000);
        });
    } else {
        setTimeout(function() {
            const sliders = document.querySelectorAll('.image-comparison-slider');
            if (sliders.length > 0) {
                console.log('页面已加载，立即初始化所有对比滑块');
                initDynamicSliders(sliders);
            }
        }, 2000);
    }
})();
