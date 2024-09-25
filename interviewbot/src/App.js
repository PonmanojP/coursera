import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Text } from '@react-three/drei';
import * as THREE from 'three';

// Ripple Effect Function
const RippleEffect = ({ speaking }) => {
  const [ripples, setRipples] = useState([]);
  const rippleIntervalRef = useRef(null);

  const createRipple = () => {
    const ripple = new THREE.Mesh(
      new THREE.CircleGeometry(1, 150),
      new THREE.MeshBasicMaterial({ color: 'rgba(0, 150, 255, 0.5)', transparent: true })
    );
    ripple.position.set(0, -2, 0); // Position behind the model
    ripple.scale.set(2, 2, 1); // Start small
    ripple.rotateY(Math.PI / 2);
    setRipples((prevRipples) => [...prevRipples, ripple]);
  };

  useEffect(() => {
    if (speaking) {
      rippleIntervalRef.current = setInterval(createRipple, 500); // Adjust the interval for ripple frequency
    } else {
      clearInterval(rippleIntervalRef.current);
      rippleIntervalRef.current = null;
    }

    return () => {
      clearInterval(rippleIntervalRef.current);
    };
  }, [speaking]);

  useFrame(() => {
    setRipples((prevRipples) =>
      prevRipples
        .map((ripple) => {
          ripple.scale.x += 0.02; // Scale up in x
          ripple.scale.y += 0.02; // Scale up in y
          ripple.material.opacity -= 0.01; // Fade out effect
          return ripple;
        })
        .filter((ripple) => ripple.material.opacity > 0) // Remove faded ripples
    );
  });

  return (
    <>
      {ripples.map((ripple, index) => (
        <primitive key={index} object={ripple} />
      ))}
    </>
  );
};

// Main Component
const App = () => {
  const { scene, animations } = useGLTF('/chatbot.glb');
  const mixer = useRef(null);
  const modelRef = useRef(null);
  const [speaking, setSpeaking] = useState(false);
  const [text, setText] = useState('');
  const [initialized, setInitialized] = useState(false);

  // Initialize model and animations
  useEffect(() => {
    if (animations.length > 0) {
      mixer.current = new THREE.AnimationMixer(scene);
      animations.forEach((anim) => {
        mixer.current.clipAction(anim).play();
      });
    }

    if (modelRef.current) {
      modelRef.current.position.set(0, -5, 0); // Initial position off-screen
    }
  }, [animations, scene]);

  useEffect(() => {
    if (mixer.current) {
      mixer.current.update(0.016); // Update every frame
    }
  }, [speaking]);

  useEffect(() => {
    const animateBounce = () => {
      if (modelRef.current) {
        const time = Date.now() * 0.0008;
        const bounceHeight = Math.sin(time) / 2; // Bounce height can be adjusted
        modelRef.current.position.y = -5 + bounceHeight; // Adjust model position
      }
      requestAnimationFrame(animateBounce);
    };

    if (initialized) {
      animateBounce();
    }
  }, [initialized]);

  useEffect(() => {
    if (speaking) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);

      utterance.onend = () => {
        setSpeaking(false);
      };
    }
  }, [speaking, text]);

  const handleWakeUp = () => {
    setInitialized(true);
    setText('Hey, what\'s up? How is it going?'); // Set initial text
    setSpeaking(true);
  };

  const handleSpeechInput = (event) => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
      setSpeaking(true);
    };

    recognition.start();
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey) {
        handleSpeechInput();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>
      <Canvas
        camera={{ position: [15, 0, 1], fov: 80 }} // Adjust camera position and field of view
        style={{backgroundColor:'#fffeab'}}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {initialized && <primitive ref={modelRef} object={scene} scale={2} />}
        {initialized && <RippleEffect speaking={speaking} />}
        {initialized && (
          <Text
            position={[0, -8, 0]} // Position the text below the model
            fontSize={1}
            color="black"
            anchorX="center"
            anchorY="middle"
            rotation={[0, Math.PI / 2, 0]} // Rotate text around the z-axis
          >
            {text}
          </Text>
        )}
        <OrbitControls
          enableZoom={false} // Disable zooming
          enablePan={false}  // Disable panning
        />
      </Canvas>

      {!initialized && (
        <button
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform:'translate(-50%,-50%)',
            padding: '10px 20px',
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            fontSize : '32px',
            cursor: 'pointer',
            borderRadius:'20px'
          }}
          onClick={handleWakeUp}
        >
          Summon Him
        </button>
      )}
    </div>
  );
};

export default App;
