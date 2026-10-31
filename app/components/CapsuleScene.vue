<script setup lang="ts">
import type * as Three from "three";
import { onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps<{ open: boolean; poster: string; scrollProgress?: number }>();
const host = ref<HTMLDivElement | null>(null);
const hasWebgl = ref(true);
let disposeScene: (() => void) | undefined;

onMounted(async () => {
  const mount = host.value;
  if (!mount) return;

  try {
    const THREE = await import("three");
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = "capsule-canvas";
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.style.touchAction = "pan-y";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(37, 1, 0.1, 50);
    camera.position.set(0, 1.7, 8.6);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xb4d8ff, 1.75));
    const blueLight = new THREE.PointLight(0x22aaff, 42, 12);
    blueLight.position.set(-4, 3, 4);
    scene.add(blueLight);
    const redLight = new THREE.PointLight(0xff365f, 24, 12);
    redLight.position.set(4, 2, -2);
    scene.add(redLight);
    const topLight = new THREE.DirectionalLight(0xe9f4ff, 2.2);
    topLight.position.set(0, 5, 3);
    scene.add(topLight);

    const capsule = new THREE.Group();
    scene.add(capsule);

    const velvet = new THREE.MeshStandardMaterial({ color: 0x090f1c, roughness: 0.76, metalness: 0.12 });
    const blueMetal = new THREE.MeshStandardMaterial({ color: 0x138be8, emissive: 0x087dd9, emissiveIntensity: 0.85, metalness: 0.76, roughness: 0.24 });
    const redMetal = new THREE.MeshStandardMaterial({ color: 0xd62d4d, emissive: 0x7b142e, emissiveIntensity: 0.65, metalness: 0.68, roughness: 0.28 });
    const glass = new THREE.MeshPhysicalMaterial({ color: 0x9ddcff, transparent: true, opacity: 0.14, roughness: 0.08, metalness: 0.18, depthWrite: false, side: THREE.DoubleSide });
    const glassEdge = new THREE.LineBasicMaterial({ color: 0x55b9ff, transparent: true, opacity: 0.88 });

    const addBox = (parent: Three.Object3D, size: [number, number, number], position: [number, number, number], material: Three.Material) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
      mesh.position.set(...position);
      parent.add(mesh);
      return mesh;
    };

    addBox(capsule, [4.85, 0.26, 3.1], [0, -1.24, 0], blueMetal);
    addBox(capsule, [4.56, 0.09, 2.87], [0, -1.08, 0], velvet);

    // Transparent side walls and rear wall leave the central product art readable.
    addBox(capsule, [0.08, 2.35, 2.9], [-2.33, 0.03, 0], glass);
    addBox(capsule, [0.08, 2.35, 2.9], [2.33, 0.03, 0], glass);
    addBox(capsule, [4.58, 2.35, 0.07], [0, 0.03, -1.44], glass);
    addBox(capsule, [4.58, 2.35, 0.035], [0, 0.03, 1.43], glass);

    // Blue-lit picture plane uses the supplied open-case reference as the interior display.
    const productPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(4.42, 2.49),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.96, side: THREE.DoubleSide, toneMapped: false }),
    );
    productPlane.position.set(0, 0.0, -1.395);
    capsule.add(productPlane);
    new THREE.TextureLoader().load(
      props.poster,
      texture => {
        texture.colorSpace = THREE.SRGBColorSpace;
        (productPlane.material as Three.MeshBasicMaterial).map = texture;
        (productPlane.material as Three.MeshBasicMaterial).needsUpdate = true;
      },
      undefined,
      () => { hasWebgl.value = false; },
    );

    // Crisp rails make the transparent acrylic outline legible in three dimensions.
    const frontZ = 1.47;
    addBox(capsule, [4.78, 0.055, 0.075], [0, 1.2, frontZ], blueMetal);
    addBox(capsule, [4.78, 0.055, 0.075], [0, -1.13, frontZ], blueMetal);
    addBox(capsule, [0.06, 2.38, 0.075], [-2.38, 0.03, frontZ], blueMetal);
    addBox(capsule, [0.06, 2.38, 0.075], [2.38, 0.03, frontZ], blueMetal);
    addBox(capsule, [4.72, 0.045, 0.065], [0, 1.2, -1.48], redMetal);
    addBox(capsule, [4.72, 0.045, 0.065], [0, -1.13, -1.48], redMetal);

    const lid = new THREE.Group();
    lid.position.set(0, 1.16, -1.43);
    capsule.add(lid);
    addBox(lid, [4.82, 0.075, 3.02], [0, 0, 1.49], glass);
    addBox(lid, [4.82, 0.055, 0.075], [0, 0.02, 2.98], blueMetal);
    addBox(lid, [4.82, 0.045, 0.065], [0, -0.02, 0.02], redMetal);
    addBox(lid, [0.065, 0.055, 3.02], [-2.39, 0.02, 1.49], blueMetal);
    addBox(lid, [0.065, 0.055, 3.02], [2.39, 0.02, 1.49], blueMetal);

    for (const x of [-2.17, 2.17]) {
      const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.36, 16), redMetal);
      hinge.rotation.z = Math.PI / 2;
      hinge.position.set(x, 1.13, -1.38);
      capsule.add(hinge);
    }

    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(2.62, 0.014, 8, 96),
      new THREE.MeshBasicMaterial({ color: 0x36b5ff, transparent: true, opacity: 0.5 }),
    );
    halo.rotation.x = Math.PI / 2;
    halo.position.y = -1.5;
    scene.add(halo);

    const edgeGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(4.82, 2.38, 2.98));
    const outline = new THREE.LineSegments(edgeGeometry, glassEdge);
    outline.position.set(0, 0.03, 0);
    capsule.add(outline);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let targetY = 0;
    let targetX = 0;
    let frame = 0;
    let isVisible = false;
    const resize = () => {
      const width = Math.max(mount.clientWidth, 320);
      const height = Math.max(mount.clientHeight, 260);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const onPointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      targetY = ((event.clientX - rect.left) / rect.width - 0.5) * 0.42;
      targetX = ((event.clientY - rect.top) / rect.height - 0.5) * 0.14;
    };
    const onPointerLeave = () => { targetY = 0; targetX = 0; };
    renderer.domElement.addEventListener("pointermove", onPointerMove, { passive: true });
    renderer.domElement.addEventListener("pointerleave", onPointerLeave, { passive: true });

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();
    const clock = new THREE.Clock();
    const animate = () => {
      if (!isVisible) return;
      frame = window.requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const scrollYaw = prefersReducedMotion ? 0 : (props.scrollProgress ?? 0) * 0.9;
      const ambientYaw = prefersReducedMotion ? 0 : Math.sin(elapsed * 0.32) * 0.025;
      capsule.rotation.y += (targetY + scrollYaw + ambientYaw - capsule.rotation.y) * 0.035;
      capsule.rotation.x += (targetX - capsule.rotation.x) * 0.035;
      capsule.position.y = prefersReducedMotion ? 0 : Math.sin(elapsed * 0.72) * 0.035;
      const wantedLid = props.open ? -1.12 : 0;
      lid.rotation.x += (wantedLid - lid.rotation.x) * 0.055;
      halo.rotation.z = prefersReducedMotion ? 0 : elapsed * 0.08;
      renderer.render(scene, camera);
    };
    const visibilityObserver = new IntersectionObserver(entries => {
      isVisible = entries.some(entry => entry.isIntersecting);
      if (isVisible && !frame) animate();
      else if (!isVisible && frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
    }, { rootMargin: "100px" });
    visibilityObserver.observe(mount);

    disposeScene = () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerleave", onPointerLeave);
      scene.traverse(object => {
        if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach(material => {
            const map = (material as Three.MeshBasicMaterial).map;
            map?.dispose();
            material.dispose();
          });
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  } catch {
    hasWebgl.value = false;
  }
});

onBeforeUnmount(() => disposeScene?.());
</script>

<template>
  <div ref="host" class="capsule-scene" :class="{ 'no-webgl': !hasWebgl }" role="img" aria-label="Vue 3D interactive de la Collector Capsule NEON SAGA">
    <img v-if="!hasWebgl" class="capsule-scene__fallback" :src="poster" alt="Coffret NEON SAGA ouvert et ses pièces" />
    <div class="capsule-scene__grain" aria-hidden="true"></div>
    <div class="capsule-scene__label"><span class="status-dot"></span> MODÈLE 3D / INTERACTIF</div>
    <div class="capsule-scene__instruction">Déplacez le pointeur pour observer l’écrin</div>
  </div>
</template>
