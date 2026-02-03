import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('ablur-layer')
export class Layer extends LitElement {
    @property({type: Number}) layers = 2;
    @property({type: Number}) baseBlur = 12;
    @property({type: Number, attribute: 'end-at'}) endAt = 0;
    @property({type: String}) height = '100%';
    @property({type: Boolean, reflect: true}) flip = false;


    static styles = css`
        :host {
            display: block;
            position: absolute;
            inset: 0;
        }

        .container {
            width: 100%;
            height: 100%;
        }

        .gradient-blur {
            position: absolute;
            z-index: 5;
            top: 0;
            left: 0;
            width: 100%;
            height: var(--ablur-height);
            pointer-events: none;
            overflow: hidden;
        }

        .slice {
            position: absolute;
            inset: 0;
            pointer-events: none;
        }

        .slice.add {
            -webkit-mask-composite: source-over;
            mask-composite: add;
        }

        .children {
            width: 100%;
            height: 100%;
            position: absolute;
            z-index: 999;
        }
    `;

    private clamp(v: number, min: number, max: number) {
        return Math.max(min, Math.min(max, v));
    }

    private clampPct(v: number) {
        return this.clamp(v, 0, 100);
    }

    private blurCss(px: number) {
        return `backdrop-filter: blur(${px}px); -webkit-backdrop-filter: blur(${px}px);`;
    }

    private get gradientDir() {
        return this.flip ? 'to top' : 'to bottom';
    }

    private endAtFromTop(endAt: number) {
        return this.clampPct(endAt);
    }

    private rampMaskCss(endAt: number) {
        const eps = 0.001;
        const e = this.endAtFromTop(endAt);
        const e2 = this.clampPct(e + eps);
        const mask = `linear-gradient(${this.gradientDir}, rgba(0,0,0,0) 0%, rgba(0,0,0,1) ${e}%, rgba(0,0,0,1) ${e2}%, rgba(0,0,0,1) 100%)`;
        return `mask-image: ${mask}; -webkit-mask-image: ${mask};`;
    }

    private weightMaskCss(layerIndex: number, total: number, endAt: number) {
        const e = this.endAtFromTop(endAt);
        if (e <= 0) {
            const mask = `linear-gradient(${this.gradientDir}, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 100%)`;
            return `mask-image: ${mask}; -webkit-mask-image: ${mask};`;
        }

        const t = (layerIndex + 1) / (total + 1);
        const s = e * (t * 0.9);
        const mask = `linear-gradient(${this.gradientDir}, rgba(0,0,0,0) 0%, rgba(0,0,0,0) ${s}%, rgba(0,0,0,1) ${e}%, rgba(0,0,0,1) 100%)`;
        return `mask-image: ${mask}; -webkit-mask-image: ${mask};`;
    }

    render() {
        const total = Math.max(1, Math.floor(this.layers));
        const endAt = this.clampPct(this.endAt);
        const maxBlur = Math.max(0, this.baseBlur);

        const slices = Array.from({length: total}).map((_, i) => {
            const t = (i + 1) / total;
            const blur = maxBlur * t;
            const z = 1 + i;
            const style = `z-index: ${z}; ${this.blurCss(blur)} ${this.weightMaskCss(i, total, endAt)}`;
            return html`
                <div class="slice add" style="${style}"></div>`;
        });

        const tailStyle = `z-index: ${1 + total}; ${this.blurCss(maxBlur)} ${this.rampMaskCss(endAt)}`;

        return html`
            <div class="container">
                <div class="gradient-blur" style="--ablur-height: ${this.height}">
                    ${slices}
                    <div class="slice" style="${tailStyle}"></div>
                </div>
                <div class="children">
                    <slot></slot>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'ablur-layer': Layer;
    }
}