import p5 from "p5";
import { type Ref } from "vue";

import shader_frag from "@/assets/starfield.frag"
import shader_vert from "@/assets/starfield.vert"

type SKETCH_PROPS = {
  speed_ref: Ref<number>
  parent_ref: HTMLElement
}

export const sketch_builder = (props: SKETCH_PROPS) => (p: p5) => {

  let width = props.parent_ref.clientWidth
  let height = props.parent_ref.clientHeight

  let shader: p5.Shader

  function update_size() {
    width = props.parent_ref.clientWidth
    height = props.parent_ref.clientHeight
  }

  p.windowResized = (_) => {
    update_size()
    p.resizeCanvas(width, height)
  }

  p.preload = () => {
    shader = p.createShader(shader_vert, shader_frag)
  }

  p.setup = () => {
    p.createCanvas(width, height, p.WEBGL)
    p.shader(shader)
  }

  p.draw = () => {
    p.clear()
    shader.setUniform("millis", p.millis())
    p.fill("white")
  }


}


