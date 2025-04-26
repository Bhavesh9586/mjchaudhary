// Enhanced 3D Particle background inspired by https://my-personal-portfolio-two-nu.vercel.app/
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    document.body.prepend(canvas);
    
    // Create the overlay element for gradient background
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.prepend(overlay);
    
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    
    // Mouse position tracking with 3D perspective effect
    const mouse = {
        x: undefined,
        y: undefined,
        radius: 150
    };
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Handle window resize
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    });
    
    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });
    
    // Particle class with 3D effects
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.baseColor = color;
            this.color = color;
            this.speedFactor = Math.random() * 0.3 + 0.1;
            // 3D effect properties
            this.z = Math.random() * 300; // depth for 3D effect
            this.baseSize = size;
            this.baseSpeedFactor = this.speedFactor;
            this.perspective = 500; // perspective distance
            // Pulse animation properties
            this.pulse = 0;
            this.pulseSpeed = Math.random() * 0.02 + 0.01;
            this.originalSize = size;
            // Movement pattern
            this.angle = Math.random() * Math.PI * 2;
            this.angleSpeed = Math.random() * 0.001 + 0.0002;
            this.amplitude = Math.random() * 3 + 1;
        }
        
        // Update 3D position - gives depth perception
        update3D() {
            // Update angle for circular/wave motion
            this.angle += this.angleSpeed;
            
            // Add slight wave motion
            this.x += Math.cos(this.angle) * this.amplitude * this.speedFactor;
            this.y += Math.sin(this.angle) * this.amplitude * this.speedFactor;
            
            // Adjust size based on z position (depth) for 3D effect
            this.size = this.baseSize * (this.perspective / (this.perspective + this.z));
            
            // Adjust speed based on z position
            this.speedFactor = this.baseSpeedFactor * (this.perspective / (this.perspective + this.z));
            
            // Update z position (moving in 3D space)
            this.z -= 0.2;
            
            // If particle moved too far into z-depth, reset it
            if (this.z < 0) {
                this.z = 300;
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
            }
        }
        
        // Draw individual particle with glowing effect
        draw() {
            // Update pulse animation
            this.pulse += this.pulseSpeed;
            let pulseSize = this.size * (1 + Math.sin(this.pulse) * 0.2);
            
            // Create glowing effect
            let gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, pulseSize * 2);
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, pulseSize, 0, Math.PI * 2, false);
            ctx.fillStyle = gradient;
            ctx.fill();
        }
        
        // Update particle position and handle interactions
        update() {
            // Update 3D effect
            this.update3D();
            
            // Check if particle is still within canvas
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }
            
            // Check mouse collision detection - create attraction effect
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                // Calculate attraction strength based on distance
                let force = (mouse.radius - distance) / mouse.radius;
                let directionX = dx * force * 0.03;
                let directionY = dy * force * 0.03;
                
                this.directionX += directionX;
                this.directionY += directionY;
                
                // Change color on interaction
                this.color = `rgba(77, 181, 255, ${0.8 * (1 - distance/mouse.radius)})`;
            } else {
                // Reset color when not interacting
                this.color = this.baseColor;
            }
            
            // Add some random movement
            this.directionX += (Math.random() - 0.5) * 0.05;
            this.directionY += (Math.random() - 0.5) * 0.05;
            
            // Dampen velocity to prevent extreme speeds
            this.directionX *= 0.98;
            this.directionY *= 0.98;
            
            // Move particle
            this.x += this.directionX * this.speedFactor;
            this.y += this.directionY * this.speedFactor;
            
            // Draw particle
            this.draw();
        }
    }
    
    // Create particles
    function init() {
        particlesArray = [];
        let numberOfParticles = (canvas.width * canvas.height) / 8000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 5) + 1;
            let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 2) - 1;
            let directionY = (Math.random() * 2) - 1;
            
            // Colors from the reference website
            const colors = [
                'rgba(77, 181, 255, 0.8)', // Primary color - bright blue
                'rgba(0, 223, 216, 0.6)',  // Secondary color - cyan
                'rgba(110, 87, 224, 0.7)', // Accent color - purple
                'rgba(255, 255, 255, 0.5)' // White particles
            ];
            let color = colors[Math.floor(Math.random() * colors.length)];
            
            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }
    
    // Connect particles with curved lines
    function connect() {
        let opacityValue = 0.8;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                              ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y)) +
                              ((particlesArray[a].z - particlesArray[b].z) * 0.5);
                
                if (distance < (canvas.width/7) * (canvas.height/7)) {
                    opacityValue = 1 - (distance/20000);
                    
                    // Gradient line for more depth
                    let gradient = ctx.createLinearGradient(
                        particlesArray[a].x, 
                        particlesArray[a].y, 
                        particlesArray[b].x, 
                        particlesArray[b].y
                    );
                    
                    gradient.addColorStop(0, `rgba(77, 181, 255, ${opacityValue * 0.5})`);
                    gradient.addColorStop(1, `rgba(110, 87, 224, ${opacityValue * 0.2})`);
                    
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 1 * ((particlesArray[a].size + particlesArray[b].size) / 20);
                    
                    // Draw line between particles
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }
    
    // Fix canvas position
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';
    
    // Create floating blobs in the background for extra depth
    function createBackgroundBlobs() {
        const numberOfBlobs = 5;
        for (let i = 0; i < numberOfBlobs; i++) {
            const blob = document.createElement('div');
            blob.className = 'background-blob';
            
            // Random position and size
            const size = Math.random() * 300 + 100;
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            
            // Apply styles
            blob.style.width = `${size}px`;
            blob.style.height = `${size}px`;
            blob.style.left = `${left}%`;
            blob.style.top = `${top}%`;
            blob.style.opacity = Math.random() * 0.15 + 0.05;
            
            // Add to body
            document.body.appendChild(blob);
        }
    }
    
    // Initialize and start animation
    init();
    animate();
    createBackgroundBlobs();
});
