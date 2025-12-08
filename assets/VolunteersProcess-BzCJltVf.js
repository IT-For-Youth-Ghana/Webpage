import{u as c,j as t,m as i}from"./animations-D4aE4ZH-.js";import{a as l}from"./vendor-Dztk_LuL.js";import{S as p}from"./SEO-DyshgdKB.js";import{H as d}from"./Hero-8s7ckvIG.js";import{n as u}from"./navigation-D_u-hcUE.js";import"./seo-YELAgV3Z.js";import"./index-DG4sxGwH.js";const v=()=>{const a=l.useRef(null),r=c(a,{once:!0,amount:.1}),s=()=>{u()},m=l.useMemo(()=>[{step:1,title:"Application & Interest Assessment",description:"Complete our volunteer application form with your skills, interests, and availability",duration:"10-15 minutes",hasButton:!0},{step:2,title:"Getting to Know You Call",description:"Personal conversation to understand your motivations and ensure mutual alignment",duration:"30-45 minutes"},{step:3,title:"Skills Assessment & Role Matching",description:"We identify your strengths and match you with the perfect volunteer opportunity",duration:"1 week"},{step:4,title:"Comprehensive Orientation",description:"Learn about our programs, meet the team, and understand our methodologies",duration:"2 hours"},{step:5,title:"Mentorship & Ongoing Support",description:"Begin your volunteer journey with dedicated mentorship and continuous support",duration:"Ongoing"}],[]);return t.jsxs(t.Fragment,{children:[t.jsx(p,{title:"How It Works - For Volunteers | IT for Youth Ghana",description:"Step-by-step guide to becoming a volunteer. From application to mentorship - here's your journey to making impact.",canonical:"/how-it-works/volunteers"}),t.jsxs("div",{id:"main-content",className:"min-h-screen bg-white pt-24",children:[t.jsx(d,{title:"Your Volunteer Journey",subtitle:"How It Works - For Volunteers",description:"A clear, step-by-step path from application to active volunteering. We guide you every step of the way to make meaningful impact."}),t.jsx("section",{ref:a,className:"section bg-white",children:t.jsxs("div",{className:"container",children:[t.jsx("div",{className:"max-w-4xl mx-auto",children:t.jsxs("div",{className:"relative timeline-container",children:[t.jsx("div",{className:"timeline-line absolute left-1/2 top-0 bottom-0 w-0.5 transform -translate-x-1/2",style:{backgroundColor:"rgba(12, 45, 90, 0.2)"}}),m.map((e,n)=>t.jsxs(i.div,{initial:{opacity:0,y:20},animate:r?{opacity:1,y:0}:{},transition:{duration:window.innerWidth<=768?.3:.6,delay:window.innerWidth<=768?n*.05:n*.1,ease:"easeOut"},className:`relative mb-12 flex step-container ${n%2===0?"flex-row":"flex-row-reverse"}`,children:[t.jsx("div",{className:"timeline-point absolute left-1/2 top-6 transform -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold z-10",style:{backgroundColor:"#0c2d5a"},children:e.step}),t.jsx("div",{className:`content-card w-5/12 ${n%2===0?"pr-8 text-right":"pl-8"}`,children:t.jsxs("div",{className:"bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-full border p-6",style:{borderColor:"rgba(12, 45, 90, 0.1)"},children:[t.jsxs("div",{className:`flex flex-col header-container ${n%2===0?"sm:flex-row-reverse":"sm:flex-row"} sm:items-center sm:justify-between mb-3`,children:[t.jsx("h3",{className:"heading-sm",style:{color:"#0c2d5a"},children:e.title}),t.jsx("span",{className:"text-sm font-medium mt-1 sm:mt-0 px-2 py-1 rounded-full",style:{color:"#0c2d5a",backgroundColor:"rgba(12, 45, 90, 0.1)"},children:e.duration})]}),t.jsx("p",{className:"text-body text-gray-600 mb-4 leading-relaxed",children:e.description}),e.hasButton&&t.jsx(i.button,{className:`button-alignment ${n%2===0?"ml-auto":""}`,style:{padding:"12px 24px",borderRadius:"50px",background:"#0c2d5a",color:"white",border:"none",fontWeight:"600",fontSize:"14px",cursor:"pointer",boxShadow:"0 4px 15px rgba(12, 45, 90, 0.3)",transition:"all 0.3s ease"},onMouseEnter:o=>{o.currentTarget.style.transform="translateY(-2px) scale(1.05)",o.currentTarget.style.boxShadow="0 6px 20px rgba(12, 45, 90, 0.4)"},onMouseLeave:o=>{o.currentTarget.style.transform="translateY(0) scale(1)",o.currentTarget.style.boxShadow="0 4px 15px rgba(12, 45, 90, 0.3)"},whileHover:window.innerWidth>768?{scale:1.05}:{},whileTap:{scale:.98},transition:{duration:.15},onClick:s,children:"Start Application"})]})}),t.jsx("div",{className:"empty-space w-5/12"})]},e.step))]})}),t.jsx(i.div,{initial:{opacity:0,y:30},animate:r?{opacity:1,y:0}:{},transition:{duration:.8,delay:.8},className:"text-center mt-16",children:t.jsxs("div",{className:"rounded-2xl p-8 border",style:{backgroundColor:"rgba(12, 45, 90, 0.05)",borderColor:"rgba(12, 45, 90, 0.1)"},children:[t.jsx("h3",{className:"heading-md mb-4",style:{color:"#0c2d5a"},children:"Ready to Make a Difference?"}),t.jsx("p",{className:"text-lg mb-6 max-w-2xl mx-auto text-gray-700",children:"Join our community of passionate volunteers. Start your application today and begin making meaningful impact in Ghana's tech ecosystem."}),t.jsx(i.button,{whileHover:{scale:1.05},whileTap:{scale:.95},onClick:s,style:{padding:"16px 32px",borderRadius:"50px",background:"#0c2d5a",color:"white",border:"none",fontWeight:"600",fontSize:"16px",cursor:"pointer",boxShadow:"0 8px 25px rgba(12, 45, 90, 0.3)",transition:"all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"},onMouseEnter:e=>{e.currentTarget.style.transform="translateY(-3px) scale(1.05)",e.currentTarget.style.boxShadow="0 12px 30px rgba(12, 45, 90, 0.4)"},onMouseLeave:e=>{e.currentTarget.style.transform="translateY(0) scale(1)",e.currentTarget.style.boxShadow="0 8px 25px rgba(12, 45, 90, 0.3)"},children:"Begin Volunteer Application"})]})})]})})]}),t.jsx("style",{children:`
        /* Performance optimizations for mobile */
        @media (max-width: 768px) {
          /* Enable hardware acceleration */
          .step-container {
            transform: translateZ(0);
            will-change: transform, opacity;
          }
          
          /* Optimize animations for mobile */
          .timeline-point,
          .content-card {
            backface-visibility: hidden;
            transform: translateZ(0);
          }
          
          /* Reduce motion for better performance */
          .timeline-container {
            position: relative !important;
          }
          
          /* Timeline Linie links positionieren auf Mobile */
          .timeline-line {
            left: 20px !important;
            transform: none !important;
            background-color: rgba(12, 45, 90, 0.2) !important;
          }
          
          /* Alle Steps als single column auf Mobile */
          .step-container {
            flex-direction: column !important;
            margin-bottom: 24px !important;
            padding-left: 40px !important;
          }
          
          /* Timeline Punkt links positionieren */
          .timeline-point {
            left: 20px !important;
            top: 8px !important;
            transform: none !important;
            width: 32px !important;
            height: 32px !important;
          }
          
          /* Content Card full width auf Mobile */
          .content-card {
            width: 100% !important;
            padding: 0 !important;
            text-align: left !important;
          }
          
          /* Empty space entfernen auf Mobile */
          .empty-space {
            display: none !important;
          }
          
          /* Header immer links ausrichten auf Mobile */
          .header-container {
            flex-direction: column !important;
            align-items: flex-start !important;
            text-align: left !important;
          }
          
          /* Button immer links ausrichten auf Mobile */
          .button-alignment {
            margin-left: 0 !important;
            align-self: flex-start !important;
          }
          
          /* Hero Section mobile Optimierung */
          .hero-section {
            padding-top: 15vh !important; /* Navigation nimmt 15% ein */
            padding-bottom: 2rem !important;
            min-height: 50vh !important;
          }
          
          /* Hero Text sizing für Mobile */
          .hero-section h1 {
            font-size: clamp(1.75rem, 5vw, 2.25rem) !important;
            line-height: 1.2 !important;
          }
          
          .hero-section p {
            font-size: clamp(0.9rem, 3vw, 1.1rem) !important;
            line-height: 1.5 !important;
          }
          
          /* Buttons stack vertical auf Mobile */
          .hero-section .flex {
            flex-direction: column !important;
            gap: 1rem !important;
          }
          
          .hero-section .btn {
            width: 100% !important;
            max-width: 280px !important;
            margin: 0 auto !important;
          }
        }
      `})]})};export{v as default};
