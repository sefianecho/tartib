const verticalList = new Tartib('.vertical');
const horizontalList = new Tartib('.horizontal');
const gridList = new Tartib('.grid');
const listWithHandle = new Tartib('.with-handle', {
    dragHandle: '.handle',
    cursor: 'move',
});

const placeholderStyle = new Tartib('.placeholder-style', {
    placeholder: 'placeholder',
    cursor: 'grabbing'
});

const itemStyle = new Tartib('.item-style', {
    active: 'item',
    cursor: 'move',
    elevation: false,
});

// Sections.
const sections = document.querySelectorAll('section');
const sidePanel = document.querySelector('.side-panel');

document.addEventListener('scroll', e => {

    if (getComputedStyle(sidePanel).display === 'none') {
        return;
    }

    for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        let {top, bottom } = section.getBoundingClientRect();


        if (top >= 0 && bottom > 0) {
            let link = sidePanel.querySelector('[href="#' + section.id + '"]');
            let activeLink = sidePanel.querySelector('a.active');
            if (link !== activeLink) {
                activeLink.classList.remove('active');
                link.classList.add('active');
            }
            return;
        }
    }
});