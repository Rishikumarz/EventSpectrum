import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-secondary text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-xl font-bold mb-4 font-poppins">Event<span className="text-primary">Spot</span></h3>
            <p className="text-white/70 text-sm mb-4">Discover and book tickets for the best events happening across India.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-primary transition"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-white hover:text-primary transition"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-white hover:text-primary transition"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-white hover:text-primary transition"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3 text-sm uppercase tracking-wider">Events</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li><Link href="/?category=1" className="hover:text-primary transition">Concerts</Link></li>
              <li><Link href="/?category=2" className="hover:text-primary transition">Theatre Shows</Link></li>
              <li><Link href="/?category=3" className="hover:text-primary transition">Comedy Shows</Link></li>
              <li><Link href="/?category=4" className="hover:text-primary transition">Cultural Festivals</Link></li>
              <li><Link href="/?category=5" className="hover:text-primary transition">Workshops</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-3 text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li><a href="#" className="hover:text-primary transition">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary transition">FAQs</a></li>
              <li><a href="#" className="hover:text-primary transition">Refund Policy</a></li>
              <li><a href="#" className="hover:text-primary transition">Terms & Conditions</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-3 text-sm uppercase tracking-wider">Cities</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li><a href="#" className="hover:text-primary transition">Delhi</a></li>
              <li><a href="#" className="hover:text-primary transition">Mumbai</a></li>
              <li><a href="#" className="hover:text-primary transition">Bangalore</a></li>
              <li><a href="#" className="hover:text-primary transition">Chennai</a></li>
              <li><a href="#" className="hover:text-primary transition">Kolkata</a></li>
              <li><a href="#" className="hover:text-primary transition">Hyderabad</a></li>
            </ul>
          </div>
          
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h4 className="font-medium mb-3 text-sm uppercase tracking-wider">Download Our App</h4>
            <p className="text-white/70 text-sm mb-3">Book tickets on the go with our mobile app.</p>
            <div className="flex space-x-2">
              <a href="#" className="block">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png" alt="Get it on Google Play" className="h-10" />
              </a>
              <a href="#" className="block">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/2560px-Download_on_the_App_Store_Badge.svg.png" alt="Download on App Store" className="h-10" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-xs">© {new Date().getFullYear()} EventSpot. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-4 text-white/60 text-xs">
            <a href="#" className="hover:text-primary transition">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition">Terms of Service</a>
            <a href="#" className="hover:text-primary transition">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
